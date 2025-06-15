import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Slider from "./components/LogoSlider";
import Products from "./components/Products";
import News from "./components/News";
import About from "./components/About";
import Footer from "./components/Footer";
import ProductDetail from "./components/ProductDetails";
import ProductRecommendations from "./components/ProductRecomendations";
import SewerCalculator from "./components/SewerCalculator";

import AdminPanel from "./admin/AdminPanel";
import ProductForm from "./admin/ProductForm";
import Edit from "./admin/Edit";
import AdminProducts from "./admin/AdminProducts";
import AdminSettings from "./admin/AdminSettings";
import AdminOrders from "./admin/AdminOrders";
import AdminOrderCard from "./admin/AdminOrderCard";
import AdminUsers from "./admin/AdminUsers";
import AdminUserCard from "./admin/AdminUserCard";

import UserPanel from './users/UserPanel'
import UserOrders from './users/UserOrders'
import UserSettings from "./users/UserSettings";


import AuthPage from "./auth/AuthPage"; 
import AdminAuth from "./auth/AdminAuth";
import PrivateRoute from "./auth/PrivateRoute";
import PrivateRouteUser from "./auth/PrivateRouteUser";

import ModelMockup from "./3dMockup/ModelMockup";
import TshirtMockupApp from "./3dMockup/TshirtMockupApp";

import OrderPage from "./orders/OrdersPage";



const App = () => {
  return (
    <Router>
      <Routes>
        {/* Foydalanuvchilar uchun asosiy sahifa */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Hero />
              <Slider />
              <Products />
              <ProductRecommendations />
              <News />
              <About />
              <Footer />
            </>
          }
        />
        <Route path="/products" element={<Products />} />

        <Route
          path="/teexverse"
          element={
            <>
              <Navbar />
              <Hero />
              <Products />
            </>
          }
        />

        {/* Auth sahifa: Login / Register */}

        
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/admin/auth" element={<AdminAuth />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/mockup" element={<ModelMockup />} />
        <Route path="/tmockup" element={<TshirtMockupApp />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/adminordercard" element={<AdminOrderCard />} />
        <Route path="/sewer" element={<SewerCalculator />} />
        

        {/* Admin Panel sahifasi */}
        {/* Auth sahifasiga yo'naltirish */}
        <Route path="/admin/auth" element={<AdminAuth />} />

        {/* PrivateRoute yordamida autentifikatsiya talab qiladigan sahifalar */}
        <Route
          path="/admin"
          element={<PrivateRoute element={<AdminPanel />} />}
        />
        <Route
          path="/admin/products"
          element={<PrivateRoute element={<AdminProducts />} />}
        />
        <Route
          path="/admin/products/add"
          element={<PrivateRoute element={<ProductForm />} />}
        />
        <Route
          path="/admin/settings"
          element={<PrivateRoute element={<AdminSettings />} />}
        />
        <Route
          path="/admin/orders"
          element={<PrivateRoute element={<AdminOrders />} />}
        />
        <Route
          path="/admin/users"
          element={<PrivateRoute element={<AdminUsers />} />}
        />
        <Route
          path="/admin/usercard"
          element={<PrivateRoute element={<AdminUserCard />} />}
        />
        <Route
          path="/admin/products/edit/:id"
          element={<PrivateRoute element={<Edit />} />}
        />


        {/* UserPanel */}

        <Route path="/auth" element={<AuthPage />} />
        
        <Route
          path="/account"
          element={<PrivateRouteUser element={<UserPanel />} />}
        />
        <Route
          path="/account/orders"
          element={<PrivateRouteUser element={<UserOrders />} />}
        />
        <Route
          path="/account/settings"
          element={<PrivateRouteUser element={<UserSettings />} />}
        />



      </Routes>
    </Router>
  );
};

export default App;
