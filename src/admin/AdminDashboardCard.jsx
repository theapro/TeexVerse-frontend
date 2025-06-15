import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardCards = ({ stats }) => {
  const navigate = useNavigate();
  return (
    <>
      {/* Products Card */}
      <div className="bg-white rounded-xl p-6 shadow-customm border border-[#d6c4c499] relative overflow-hidden group hover:shadow-xl transition-all duration-300">
        <div className="absolute top-0 left-0 w-2 h-full bg-[#0fd6a0]"></div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 font-medium mb-1">Products</p>
            <p className="text-3xl font-bold text-black">{stats.products}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#0fd6a0] bg-opacity-10 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-[#0fd6a0]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              ></path>
            </svg>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm text-[#0fd6a0]">
            <span
              className="font-medium cursor-pointer text-codee hover:underline"
              onClick={() => navigate("/admin/products")}
            >
              Details
            </span>
            <svg
              className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Orders Card */}
      <div className="bg-white rounded-xl p-6 shadow-customm border border-[#d6c4c499] relative overflow-hidden group hover:shadow-xl transition-all duration-300">
        <div className="absolute top-0 left-0 w-2 h-full bg-black"></div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 font-medium mb-1">Orders</p>
            <p className="text-3xl font-bold text-black">{stats.orders}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-black bg-opacity-10 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              ></path>
            </svg>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm text-black">
            <span
              className="font-medium cursor-pointer text-black hover:underline"
              onClick={() => navigate("/admin/orders")}
            >
              Details
            </span>
            <svg
              className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Users Card */}
      <div className="bg-white rounded-xl p-6 shadow-customm border border-[#d6c4c499] relative overflow-hidden group hover:shadow-xl transition-all duration-300">
        <div className="absolute top-0 left-0 w-2 h-full bg-[#0fd6a0]"></div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 font-medium mb-1">Users</p>
            <p className="text-3xl font-bold text-black">{stats.users}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#0fd6a0] bg-opacity-10 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-[#0fd6a0]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              ></path>
            </svg>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm text-[#0fd6a0]">
            <span
              className="font-medium cursor-pointer text-codee hover:underline"
              onClick={() => navigate("/admin/users")}
            >
              Details
            </span>
            <svg
              className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardCards;
