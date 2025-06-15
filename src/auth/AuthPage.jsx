import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", username: "" });
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await axios.post(
          "http://localhost:5000/api/auth/login",
          form
        );
        localStorage.setItem("token", res.data.token);
        console.log("Successfully logged in");
        navigate("/account");
      } else {
        const res = await axios.post(
          "http://localhost:5000/api/auth/register",
          form
        );
        alert("Registration successful");
      }
    } catch (err) {
      setError(err.response?.data?.error || "System error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-full max-w-3xl min-h-[500px] bg-white shadow-lg rounded-xl flex">
        {/* Left Side: Branding */}
        <div className="w-1/2 bg-gray-900 text-white p-8 flex flex-col justify-center rounded-l-xl items-start">
          <img
            src="your-brand-image-url.jpg"
            alt="Brand"
            className="mb-6 w-48 h-48 object-cover rounded-full"
          />
          <h2 className="text-3xl font-semibold mb-4">TeexVerse</h2>
          <p className="text-lg text-left">
            Create your own style, wear what truly represents you
          </p>
        </div>

        {/* Right Side: Form */}
        <div className="w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-semibold text-center mb-6">
            {isLogin ? "Login to your account" : "Register for an account"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username field (visible only in Register) */}
            <div
              className={`transition-all duration-300 ${
                isLogin ? "opacity-0 h-0 overflow-hidden" : "opacity-100 h-auto"
              }`}
            >
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none"
                required={!isLogin}
                placeholder="Username"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none"
                required
                placeholder="Email"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none"
                required
                placeholder="Password"
              />
            </div>

            <button
              type="submit"
              className="w-full p-3 bg-black text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isLogin ? "Login" : "Register"}
            </button>
          </form>

          <div className="mt-4 flex flex-col text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-blue-500 hover:underline"
            >
              {isLogin
                ? "Don't have an account? Register here"
                : "Already have an account? Login"}
            </button>

            <button
              onClick={() => navigate("/admin/auth")}
              className="text-sm hover:underline text-blue-500 px-4  rounded"
            >
              Are you admin?
    
            </button>
          </div>

          {error && (
            <div className="text-red-500 text-center mt-2">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
