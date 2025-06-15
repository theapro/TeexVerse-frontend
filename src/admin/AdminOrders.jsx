import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminNavbar";
import OrderCard from "./AdminOrderCard";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState({});
  const [orderItems, setOrderItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users data
  const fetchUsersData = async () => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

    try {
     
      const response = await axios.get(`${apiUrl}/api/users`);

      if (Array.isArray(response.data)) {
        const usersObj = response.data.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {});

        setUsers(usersObj);
      } else {
        throw new Error("Unexpected users data format");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to fetch user information");

      // Add placeholder data if needed
      if (orders.length > 0) {
        const placeholderUsers = {};
        orders.forEach((order) => {
          if (!placeholderUsers[order.user_id]) {
            placeholderUsers[order.user_id] = {
              id: order.user_id,
              username: "Unknown",
            };
          }
        });
        setUsers(placeholderUsers);
      }
    }
  };

  // Fetch order items and details
  const fetchOrderDetails = async (orderId) => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

    try {
     
      const response = await axios.get(`${apiUrl}/api/orders/${orderId}`);

      setOrderItems((prevItems) => ({
        ...prevItems,
        [orderId]: response.data.items,
      }));

      return response.data;
    } catch (error) {
      console.error(`Error fetching details for order ${orderId}:`, error);
      return null;
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const endpoint = "/api/admin/orders";

    const fetchData = async () => {
      try {
        // Fetch orders
        const ordersResponse = await axios.get(`${apiUrl}${endpoint}`);

        if (Array.isArray(ordersResponse.data)) {
          const processedOrders = ordersResponse.data.map((order) => ({
            ...order,
            total_amount:
              typeof order.total_amount === "string"
                ? parseFloat(order.total_amount)
                : typeof order.total_amount === "number"
                ? order.total_amount
                : 0,
          }));

          setOrders(processedOrders);

          // Fetch users after orders are loaded
          await fetchUsersData();

          // Fetch details for each order
          const orderDetailsPromises = processedOrders.map((order) =>
            fetchOrderDetails(order.id)
          );

          await Promise.all(orderDetailsPromises);
        } else {
          throw new Error("Unexpected data format");
        }
      } catch (err) {
        console.error("Error fetching data:", err);

        if (err.response) {
          setError(`API Error: ${err.response.status}`);
        } else if (err.request) {
          setError("Connection refused. Is your backend server running?");
        } else {
          setError(`Request Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get status color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case "yangi":
        return "bg-blue-100 text-blue-800";
      case "tasdiqlandi":
        return "bg-green-100 text-green-800";
      case "jo'natildi":
        return "bg-purple-100 text-purple-800";
      case "yetkazildi":
        return "bg-teal-100 text-teal-800";
      case "bekor qilindi":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Translate status for display
  const translateStatus = (status) => {
    const translations = {
      yangi: "New",
      tasdiqlandi: "Confirmed",
      "jo'natildi": "Shipped",
      yetkazildi: "Delivered",
      "bekor qilindi": "Cancelled",
    };
    return translations[status] || status;
  };

  // Format price to display as currency
  const formatPrice = (price) => {
    if (price === null || price === undefined) return "$0.00";
    const numericPrice = typeof price === "string" ? parseFloat(price) : price;
    return isNaN(numericPrice) ? "$0.00" : `$${numericPrice.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 p-8 ml-[300px]">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="ml-4 text-lg text-gray-600">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 p-8 ml-[300px]">
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex font-poppins min-h-screen  bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 py-5 pr-5 ml-[300px]">
        <div className="flex justify-between shadow-customm p-3 border-[#e7e2e2] border rounded-xl items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Orders Management
          </h2>
          <div className="text-sm text-codee">
            {orders.length} {orders.length === 1 ? "order" : "orders"} found
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">No orders found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                user={users[order.user_id]}
                orderItems={orderItems[order.id]}
                formatPrice={formatPrice}
                translateStatus={translateStatus}
                getStatusColor={getStatusColor}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
