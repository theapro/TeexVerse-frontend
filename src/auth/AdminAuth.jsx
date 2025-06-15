import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/admin/auth/login", form);
      localStorage.setItem("adminToken", res.data.token);
      navigate("/admin"); // Auth'dan keyingi sahifa
    } catch (err) {
      setError(err.response?.data?.error || "Xatolik yuz berdi");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-full max-w-3xl min-h-[500px] bg-white shadow-lg rounded-xl flex">
        {/* Left side */}
        <div className="w-1/2 bg-gray-900 text-white p-8 flex flex-col justify-center rounded-l-xl">
          <h2 className="text-3xl font-semibold mb-4">TeexVerse Admin</h2>
          <p className="text-lg">Boshqaruv paneliga xush kelibsiz</p>
        </div>

        {/* Right side (form) */}
        <div className="w-1/2 p-8">
          <h2 className="text-3xl font-semibold text-center mb-6">Admin Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <button
              type="submit"
              className="w-full p-3 bg-black text-white rounded-md"
            >
              Login
            </button>
          </form>
          {error && <div className="text-red-500 text-center mt-2">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
