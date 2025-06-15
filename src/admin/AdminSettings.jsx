import React, { useState, useRef } from "react";
import axios from "axios";
import AdminSidebar from "./AdminNavbar";

const Settings = () => {
  const [adminInfo, setAdminInfo] = useState({
    email: "",
    password: "",
    name: "",
    profilePic: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const hiddenFileInput = useRef(null);

  // Handle input changes
  const handleChange = (e) => {
    setAdminInfo({ ...adminInfo, [e.target.name]: e.target.value });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Get and verify token
  const getToken = () => {
    const token = localStorage.getItem("adminToken");

    return token;
  };

  // Save data
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get data from form
    const data = {
      name: adminInfo.name,
      email: adminInfo.email,
      password: adminInfo.password,
      profilePic: image ? image.name : "",
    };

    const token = getToken();

    // Check token
    if (!token) {
      setError("Token not found, please log in.");

      return;
    }

    const config = {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (image) {
      formData.append("profilePic", image);
    }

    try {
      // Send PUT request
      const response = await axios.put(
        "http://localhost:5000/admin/settings",
        formData,
        config
      );

      setMessage(response.data.message || "Information updated successfully.");
      
      // Show success message and hide after 3 seconds
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      
      setError(err.response?.data?.error || "An error occurred");
      
      // Hide error after 3 seconds
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  // Upload file
  const handleUploadClick = () => {
    hiddenFileInput.current.click();
  };

  return (
    <div className="flex h-screen bg-white">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}


        {/* Main content */}
        <div className="flex-1 ml-[300px] py-5 pr-5 ">
          <div className=" mx-auto">

            {/* Settings Card */}
            <div className="bg-white rounded-xl shadow-customm border-[#9999] border overflow-hidden ">
              {/* Card Header */}
              <div className=" px-6 py-4">
                <h2 className="text-2xl font-bold text-black">Personal Information</h2>
                <p className="text-[16px] text-gray-800">Update your account settings</p>
              </div>
            {/* Status messages */}
            {error && (
              <div className=" bg-red-50 border-l-4 border-red-500 text-red-700 animate-fade-in">
                {error}
              </div>
            )}
            {message && (
              <div className=" ml-[25px] duration-300 border-[#0fd6a0] text-green-700 animate-fade-in">
                {message}
              </div>
            )}

              {/* Card Body */}
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Profile picture section */}
                    <div className="md:col-span-2 flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-[#0fd6a0] overflow-hidden mb-4">
                        {image ? (
                          <img
                            src={URL.createObjectURL(image)}
                            alt="Profile Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handleUploadClick}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-black bg-[#0fd6a0] hover:bg-[#0fc090] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0fd6a0]"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Change Profile Picture
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        ref={hiddenFileInput}
                      />
                      {image && (
                        <p className="mt-2 text-sm text-gray-500">
                          {image.name}
                        </p>
                      )}
                    </div>

                    {/* Name field */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={adminInfo.name}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0fd6a0] focus:border-[#0fd6a0]"
                          placeholder="Enter your name"
                        />
                      </div>
                    </div>

                    {/* Email field */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={adminInfo.email}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0fd6a0] focus:border-[#0fd6a0]"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    {/* Password field */}
                    <div className="md:col-span-2">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={adminInfo.password}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0fd6a0] focus:border-[#0fd6a0]"
                          placeholder="Enter new password"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Leave blank to keep current password
                      </p>
                    </div>
                  </div>

                  {/* Submit button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition duration-150"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;