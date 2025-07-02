import { useState, useEffect, useCallback, useRef } from 'react';
import { systemService } from '../services/systemService.js';
import { STATUS_LEVELS, HEALTH_CHECK_INTERVALS } from '../utils/constants.js';

/**
 * Custom hook for monitoring backend status and health
 */
export const useBackendStatus = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [healthStatus, setHealthStatus] = useState(STATUS_LEVELS.UNKNOWN);
  const [systemStats, setSystemStats] = useState(null);
  const [modelStatus, setModelStatus] = useState(null);
  const [gpuStats, setGpuStats] = useState(null);
  const [memoryStats, setMemoryStats] = useState(null);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [lastHealthCheck, setLastHealthCheck] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState(null);
  const [consecutiveFailures, setConsecutiveFailures] = useState(0);

  // Refs for managing intervals
  const healthCheckIntervalRef = useRef(null);
  const statsIntervalRef = useRef(null);

  /**
   * Check backend health
   */
  const checkHealth = useCallback(async () => {
    try {
      setIsChecking(true);
      const health = await systemService.checkHealth();
      
      setIsOnline(true);
      setHealthStatus(health.status || STATUS_LEVELS.HEALTHY);
      setLastHealthCheck(new Date().toISOString());
      setConsecutiveFailures(0);
      setError(null);
      
      return health;
    } catch (error) {
      console.error('Health check failed:', error);
      
      setIsOnline(false);
      setHealthStatus(STATUS_LEVELS.ERROR);
      setLastHealthCheck(new Date().toISOString());
      setConsecutiveFailures(prev => prev + 1);
      setError(error.message);
      
      return null;
    } finally {
      setIsChecking(false);
    }
  }, []);

  /**
   * Load system statistics
   */
  const loadSystemStats = useCallback(async () => {
    try {
      const stats = await systemService.getSystemStatus();
      setSystemStats(stats);
      return stats;
    } catch (error) {
      console.error('Failed to load system stats:', error);
      return null;
    }
  }, []);

  /**
   * Load model status
   */
  const loadModelStatus = useCallback(async () => {
    try {
      const status = await systemService.getModelStatus();
      setModelStatus(status);
      return status;
    } catch (error) {
      console.error('Failed to load model status:', error);
      return null;
    }
  }, []);

  /**
   * Load GPU statistics
   */
  const loadGpuStats = useCallback(async () => {
    try {
      const stats = await systemService.getGPUStats();
      setGpuStats(stats);
      return stats;
    } catch (error) {
      console.error('Failed to load GPU stats:', error);
      return null;
    }
  }, []);

  /**
   * Load memory statistics
   */
  const loadMemoryStats = useCallback(async () => {
    try {
      const stats = await systemService.getMemoryStats();
      setMemoryStats(stats);
      return stats;
    } catch (error) {
      console.error('Failed to load memory stats:', error);
      return null;
    }
  }, []);

  /**
   * Load performance metrics
   */
  const loadPerformanceMetrics = useCallback(async () => {
    try {
      const metrics = await systemService.getPerformanceMetrics();
      setPerformanceMetrics(metrics);
      return metrics;
    } catch (error) {
      console.error('Failed to load performance metrics:', error);
      return null;
    }
  }, []);

  /**
   * Load all statistics
   */
  const loadAllStats = useCallback(async () => {
    if (!isOnline) return;

    await Promise.allSettled([
      loadSystemStats(),
      loadModelStatus(),
      loadGpuStats(),
      loadMemoryStats(),
      loadPerformanceMetrics(),
    ]);
  }, [isOnline, loadSystemStats, loadModelStatus, loadGpuStats, loadMemoryStats, loadPerformanceMetrics]);

  /**
   * Simple connectivity check
   */
  const ping = useCallback(async () => {
    try {
      const isReachable = await systemService.ping();
      setIsOnline(isReachable);
      
      if (isReachable) {
        setConsecutiveFailures(0);
        setError(null);
      } else {
        setConsecutiveFailures(prev => prev + 1);
      }
      
      return isReachable;
    } catch (error) {
      setIsOnline(false);
      setConsecutiveFailures(prev => prev + 1);
      setError(error.message);
      return false;
    }
  }, []);

  /**
   * Get health check interval based on current status
   */
  const getHealthCheckInterval = useCallback(() => {
    if (consecutiveFailures > 0) {
      return HEALTH_CHECK_INTERVALS.FAST;
    } else if (isOnline && healthStatus === STATUS_LEVELS.HEALTHY) {
      return HEALTH_CHECK_INTERVALS.SLOW;
    } else {
      return HEALTH_CHECK_INTERVALS.NORMAL;
    }
  }, [consecutiveFailures, isOnline, healthStatus]);

  /**
   * Start monitoring
   */
  const startMonitoring = useCallback(() => {
    // Initial health check
    checkHealth();

    // Setup health check interval
    const healthInterval = () => {
      healthCheckIntervalRef.current = setTimeout(() => {
        checkHealth().then(() => {
          healthInterval(); // Schedule next check
        });
      }, getHealthCheckInterval());
    };

    healthInterval();

    // Setup stats interval (less frequent)
    const statsInterval = () => {
      statsIntervalRef.current = setTimeout(() => {
        loadAllStats().then(() => {
          statsInterval(); // Schedule next stats load
        });
      }, 30000); // Update stats every 30 seconds
    };

    // Only start stats monitoring if backend is online
    if (isOnline) {
      statsInterval();
    }
  }, [checkHealth, loadAllStats, getHealthCheckInterval, isOnline]);

  /**
   * Stop monitoring
   */
  const stopMonitoring = useCallback(() => {
    if (healthCheckIntervalRef.current) {
      clearTimeout(healthCheckIntervalRef.current);
      healthCheckIntervalRef.current = null;
    }
    
    if (statsIntervalRef.current) {
      clearTimeout(statsIntervalRef.current);
      statsIntervalRef.current = null;
    }
  }, []);

  /**
   * Restart monitoring with new interval
   */
  const restartMonitoring = useCallback(() => {
    stopMonitoring();
    startMonitoring();
  }, [stopMonitoring, startMonitoring]);

  /**
   * Manual refresh of all data
   */
  const refresh = useCallback(async () => {
    await checkHealth();
    if (isOnline) {
      await loadAllStats();
    }
  }, [checkHealth, isOnline, loadAllStats]);

  /**
   * Reset error state
   */
  const clearError = useCallback(() => {
    setError(null);
    setConsecutiveFailures(0);
  }, []);

  /**
   * Get overall system health level
   */
  const getOverallHealth = useCallback(() => {
    if (!isOnline) return STATUS_LEVELS.ERROR;
    
    if (healthStatus === STATUS_LEVELS.ERROR) return STATUS_LEVELS.ERROR;
    
    // Check various metrics for warnings
    if (gpuStats?.utilization > 90 || memoryStats?.usage > 90) {
      return STATUS_LEVELS.WARNING;
    }
    
    if (consecutiveFailures > 0) {
      return STATUS_LEVELS.WARNING;
    }
    
    return STATUS_LEVELS.HEALTHY;
  }, [isOnline, healthStatus, gpuStats, memoryStats, consecutiveFailures]);

  /**
   * Get formatted status message
   */
  const getStatusMessage = useCallback(() => {
    if (!isOnline) {
      return 'Backend server is offline';
    }
    
    if (isChecking) {
      return 'Checking status...';
    }
    
    const overallHealth = getOverallHealth();
    
    switch (overallHealth) {
      case STATUS_LEVELS.HEALTHY:
        return 'All systems operational';
      case STATUS_LEVELS.WARNING:
        return 'Some issues detected';
      case STATUS_LEVELS.ERROR:
        return 'System errors detected';
      default:
        return 'Status unknown';
    }
  }, [isOnline, isChecking, getOverallHealth]);

  // Initialize monitoring on mount
  useEffect(() => {
    startMonitoring();
    
    return () => {
      stopMonitoring();
    };
  }, []);

  // Update monitoring interval when status changes
  useEffect(() => {
    if (healthCheckIntervalRef.current) {
      restartMonitoring();
    }
  }, [consecutiveFailures, healthStatus, restartMonitoring]);

  // Start stats monitoring when backend comes online
  useEffect(() => {
    if (isOnline && !statsIntervalRef.current) {
      loadAllStats();
      const statsInterval = () => {
        statsIntervalRef.current = setTimeout(() => {
          loadAllStats().then(() => {
            statsInterval();
          });
        }, 30000);
      };
      statsInterval();
    } else if (!isOnline && statsIntervalRef.current) {
      clearTimeout(statsIntervalRef.current);
      statsIntervalRef.current = null;
    }
  }, [isOnline, loadAllStats]);

  return {
    // Status
    isOnline,
    healthStatus,
    isChecking,
    error,
    consecutiveFailures,
    lastHealthCheck,

    // Data
    systemStats,
    modelStatus,
    gpuStats,
    memoryStats,
    performanceMetrics,

    // Actions
    checkHealth,
    ping,
    refresh,
    clearError,
    startMonitoring,
    stopMonitoring,

    // Computed
    overallHealth: getOverallHealth(),
    statusMessage: getStatusMessage(),

    // Individual loaders
    loadSystemStats,
    loadModelStatus,
    loadGpuStats,
    loadMemoryStats,
    loadPerformanceMetrics,
  };
};

export default useBackendStatus;