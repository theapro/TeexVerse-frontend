import React from "react";
import { Route, Navigate } from "react-router-dom"; 

const PrivateRouteUser = ({ element, ...rest }) => {
  const isAuthenticated = localStorage.getItem("token"); // Admin tokenni tekshirish

  return isAuthenticated ? (
    element // Agar autentifikatsiya mavjud bo'lsa, `element`ni qaytarish
  ) : (
    <Navigate to="/auth" replace /> // Agar autentifikatsiya mavjud bo'lmasa, login sahifasiga yo'naltirish
  );
};

export default PrivateRouteUser;
