import React from "react";
import { Route, Navigate } from "react-router-dom"; 

const PrivateRoute = ({ element, ...rest }) => {
  const isAuthenticated = localStorage.getItem("adminToken"); // Admin tokenni tekshirish

  return isAuthenticated ? (
    element // Agar autentifikatsiya mavjud bo'lsa, `element`ni qaytarish
  ) : (
    <Navigate to="/admin/auth" replace /> // Agar autentifikatsiya mavjud bo'lmasa, login sahifasiga yo'naltirish
  );
};

export default PrivateRoute;
