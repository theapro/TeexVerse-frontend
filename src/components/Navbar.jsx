import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Logo from "../assets/TeexVersewhte.png";

// Menu items
const NavbarMenu = [
  {
    id: 1,
    title: "Products",
    link: "#products",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0v10l-8 4m-8-4V7m16 10l-8-4m-8 4l8-4" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Categories",
    link: "/about",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Best Selling",
    link: "#",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    id: 4,
    title: "Quality",
    link: "#",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
];

const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-black/40 blur-10 bg-opacity-90 z-10">
      <div className="container mx-auto px-4 sm:px-8 lg:px-16 xl:px-20 2xl:px-24">
        <div className="flex justify-between items-center h-[70px]">

          {/* Logo section */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img src={Logo} alt="TeexVerse" className="w-[150px] h-auto cursor-pointer hover:opacity-90 transition-all" />
            </Link>
          </div>

          {/* Middle section with menu items - desktop view */}
          <div className="hidden md:block ml-[400px]">
            <ul className="flex items-center space-x-2">
              {NavbarMenu.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.link}
                    className={`flex text-white items-center gap-2 px-4 py-2 text-[14px] font-medium uppercase tracking-wide transition-all duration-300 hover:text-[#0fd6a0] relative group`}
                    onClick={() => setActiveItem(item.id)}
                  >
                    <span className={`${activeItem === item.id ? "text-[#0fd6a0]" : ""}`}>{item.title}</span>
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-[#0fd6a0] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right section with auth */}
          <div className=" flex items-center space-x-1">
            {/* Search button */}
            <button className="p-2 hover:text-[#0fd6a0] text-white transition-all relative group">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 text-xs font-medium text-[#0fd6a0] transition-opacity duration-300">Search</span>
            </button>
            
            {/* Cart button */}
            <div className="relative group">
              <button className="p-2 text-white hover:text-[#0fd6a0] transition-all mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </button>
              <span className="absolute -top-2 -left-2 opacity-0 group-hover:opacity-100 text-xs font-medium text-[#0fd6a0] transition-opacity duration-300">Cart</span>
            </div>

            {/* Conditional rendering of login button or profile */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center text-white gap-2 hover:opacity-90 transition-all">
                  <div className="w-9 h-9 rounded-full border-2 border-[#0fd6a0] overflow-hidden bg-gray-800 flex items-center justify-center">
                    {user.profile_image ? (
                      <img
                        src={`http://localhost:5000/uploads/${user.profile_image}`}
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[#0fd6a0] font-bold">
                        {user.username?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                  <span className="text-sm uppercase font-medium hidden lg:block">{user.username}</span>
                  
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg overflow-hidden z-20 invisible opacity-0 transform translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm text-gray-600">Signed in as</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{user.email || user.username}</p>
                  </div>
                  <Link to="/account" className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </Link>
                  <Link to="/orders" className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Orders
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-[#0fd6a0] text-black font-medium py-2 px-5 rounded hover:bg-opacity-90 transition-all flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Login</span>
              </Link>
            )}
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 hover:text-[#0fd6a0] transition-all focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile menu drawer */}
        <div 
          className={`md:hidden bg-black bg-opacity-95 absolute left-0 right-0 shadow-xl transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="px-4 py-6 space-y-4">
            {NavbarMenu.map((item) => (
              <Link
                key={item.id}
                to={item.link}
                className="flex items-center gap-3 py-2 text-base font-medium text-white hover:text-[#0fd6a0] transition-all"
                onClick={() => {
                  setActiveItem(item.id);
                  setIsMobileMenuOpen(false);
                }}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
            <div className="border-t border-gray-700 pt-4 mt-4">
              {user ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full border-2 border-[#0fd6a0] overflow-hidden bg-gray-800 flex items-center justify-center">
                      {user.profile_image ? (
                        <img
                          src={`http://localhost:5000/uploads/${user.profile_image}`}
                          alt={user.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[#0fd6a0] font-bold">
                          {user.username?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <p className="text-sm text-gray-400">{user.email || "Member"}</p>
                    </div>
                  </div>
                  <Link
                    to="/account"
                    className="flex items-center gap-3 py-2 text-base font-medium text-white hover:text-[#0fd6a0] transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="flex items-center gap-3 py-2 text-base font-medium text-white hover:text-[#0fd6a0] transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 py-2 text-base font-medium text-red-500 hover:text-red-400 transition-all w-full text-left"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center justify-center gap-2 bg-[#0fd6a0] text-black font-medium py-2 px-5 rounded hover:bg-opacity-90 transition-all w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;