import React, { useState, useRef } from "react";
import { Upload, Settings, User, Mail, Lock, Check } from "lucide-react";
import UsersNavbar from "./UsersNavbar"; 
const UserSettings = () => {
  const [userInfo, setUserInfo] = useState({
    username: "",
    gender: "",
    email: "",
    password: ""
  });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const hiddenFileInput = useRef(null);

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUploadClick = () => {
    hiddenFileInput.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Mock success for demonstration purposes
    setMessage("Ma'lumotlar muvaffaqiyatli yangilandi!");
    setError("");
  };

  return (
    <>
    <UsersNavbar/>
    <div className="flex ml-[44px] py-5 pr-5  min-h-screen bg-white">
      {/* Left sidebar placeholder - normally would contain UserNavbar */}


      {/* Main content */}
      <div className="ml-64 w-full rounded-xl  shadow-customm p-8">
        <div className=" mx-auto">
          <h2 className="text-3xl font-semibold border-b pb-2 mb-8 text-black flex items-center">
            <Settings className="mr-3" size={28} color="#0fd6a0" />
            User Settings
          </h2>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          {message && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded flex items-center">
              <Check className="mr-2" size={20} color="green" />
              <p className="text-green-700">{message}</p>
            </div>
          )}

          <div className="bg-white rounded-xl  overflow-hidden">
            {/* Profile image section */}
            <div className=" p-8 flex flex-col items-center justify-center">
              <div className="relative mb-4">
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                    <User size={64} color="#0fd6a0" />
                  </div>
                )}
                <button
                  onClick={handleUploadClick}
                  className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                >
                  <Upload size={20} color="#0fd6a0" />
                </button>
              </div>
              <p className="text-black text-lg font-medium">Upload profile picture</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                ref={hiddenFileInput}
              />
            </div>

            {/* Form section */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Input 
                  label="Username" 
                  name="username" 
                  value={userInfo.username} 
                  onChange={handleChange}
                  icon={<User size={20} color="#0fd6a0" />}
                />
                <Input 
                  label="Email" 
                  name="email" 
                  type="email" 
                  value={userInfo.email} 
                  onChange={handleChange}
                  icon={<Mail size={20} color="#0fd6a0" />}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Input 
                  label="Password" 
                  name="password" 
                  type="password" 
                  value={userInfo.password} 
                  onChange={handleChange}
                  icon={<Lock size={20} color="#0fd6a0" />}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your gender</label>
                  <div className="relative">
                    <select
                      name="gender"
                      value={userInfo.gender}
                      onChange={handleChange}
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:ring-green-300 focus:border-green-300 outline-none"
                    >
                      <option value="">Default</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <User size={20} color="#0fd6a0" />
                    </div>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-black text-white py-4 rounded-lg hover:bg-gray-900 transition-all transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                <div className="flex items-center justify-center">
                  <span className="mr-2">Save changes</span>
                  <div className="w-6 h-6 rounded-full bg-[#0fd6a0] flex items-center justify-center">
                    <Check size={16} color="black" />
                  </div>
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

const Input = ({ label, name, type = "text", value, onChange, icon }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:ring-green-300 focus:border-green-300 outline-none"
        placeholder={label}
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        {icon}
      </div>
    </div>
  </div>
);

export default UserSettings;