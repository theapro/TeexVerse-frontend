import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {LogOut, Settings2, AppWindowMac, UserRoundCheck, Package, PlusCircle } from "lucide-react";

const UserNavbar = () => {
  const navigate = useNavigate();


  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth'); 
  };

  const baseLinkStyle =
    "flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 hover:text-black transition";
  const activeLinkStyle = "bg-gray-900 text-white";

  const navLinkClass = ({ isActive }) => {
    const base =
      "flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition";
    const hover = "hover:bg-gray-100 hover:text-black text-gray-600";
    const active = "bg-gray-900 text-white";
  
    return `${base} ${isActive ? active : hover}`;
  };

  return (
    <aside className="rounded-xl w-64 border-gray-300 bg-white border-r shadow-customm fixed top-[20px] left-[20px] bottom-[20px] p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">User Panel</h1>

      <nav className="flex flex-col gap-2">
        <NavLink to="/account" end className={navLinkClass}>
          <UserRoundCheck size={18} />
          User
        </NavLink>
        <NavLink to="/account/orders" end className={navLinkClass}>
          <Package size={18} />
          Orders
        </NavLink>
        <NavLink to="/account/settings" className={navLinkClass}>
          <Settings2 size={18} />
          Settings
        </NavLink>
        <NavLink to="http://localhost:5173/" className={navLinkClass}>
          <AppWindowMac size={18} />
          Main page
        </NavLink>
        
        {/* Logout link */}
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 hover:text-black transition "
        >
          <LogOut size={18}/><span className="text-red-600">Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default UserNavbar;
