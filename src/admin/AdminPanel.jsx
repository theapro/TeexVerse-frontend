import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "./AdminNavbar";
import DashboardCards from "./AdminDashboardCard";

const AdminLayout = ({ children }) => {
  const [adminInfo, setAdminInfo] = useState({
    username: "",
    email: "",
    profile_picture: "",
    role: "",
    created_at: "",
  });
  const [error, setError] = useState("");

  const fetchAdminInfo = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(
        "http://localhost:5000/admin/account/admin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAdminInfo(response.data);
    } catch (err) {
      console.error("Error while fetching admin info:", err);
      setError("Admin ma'lumotlarini yuklashda xatolik.");
    }
  };

  useEffect(() => {
    fetchAdminInfo();
  }, []);
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
  });

  const fetchDashboardStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/admin/dashboard/stats"
      );
      setStats(res.data);
    } catch (error) {
      console.error("Statistika olishda xatolik:", error);
    }
  };
  useEffect(() => {
    fetchAdminInfo();
    fetchDashboardStats();
  }, []);

  return (
    <div className="flex bg-gray-100 text-black min-h-screen">
      <AdminSidebar />

      <div className="flex-1 ml-[300px] pt-5 pr-5  bg-gray-100">
        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-700 px-6 py-4 rounded-lg mb-6 border-l-4 border-red-500 shadow-sm">
            {error}
          </div>
        )}

        {/* Admin Profile Card */}
        <div className="bg-white  rounded-xl p-6 mb-5 shadow-customm  border border-[#9999]">
          <h2 className="text-2xl font-bold mb-8 text-black border-b border-gray-100 pb-4">
            Profile
          </h2>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Profile Picture */}
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#0fd6a0] shadow-md flex-shrink-0">
              <img
                src={`http://localhost:5000/${adminInfo.profile_picture}`}
                alt="Admin"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info Section */}
            <div className="flex flex-col space-y-4 text-center md:text-left">
              <p className="text-2xl font-bold text-black">
                {adminInfo.username}
              </p>

              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#0fd6a0]"></span>
                <p className="text-lg text-gray-700">{adminInfo.email}</p>
              </div>

              <div className="inline-block px-4 py-2 bg-[#0fd6a0] bg-opacity-10 rounded-full text-[#0fd6a0] font-medium">
                {adminInfo.role}
              </div>

              <p className="text-sm text-gray-500">
                A'zo bo'lgan sana:{" "}
                {adminInfo.created_at &&
                  new Date(adminInfo.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Content area with styled heading */}
        <div className="bg-white rounded-xl border-[#9999] p-8 shadow-customm border border-gray-100">
          <div className="border-l-4 border-[#0fd6a0] pl-4 mb-6">
            <h3 className="text-xl font-bold text-black">Dashboard</h3>
            <p className="text-gray-500 mb-[40px]">Admin control panel</p>
          </div>

          {/* Cards grid directly here - don't nest grids */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-[60px]">
            <DashboardCards stats={stats} />
          </div>

          <main>{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
