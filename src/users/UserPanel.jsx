import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserNavbar from './UsersNavbar';

const UserPanel = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:5000/api/auth/account', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Xatolik:', err);
        setError('Foydalanuvchi ma\'lumotlarini olishda xatolik yuz berdi.');
        setLoading(false);
      });
  }, []);

  const handleEditClick = () => {
    navigate('/account/settings');
  };

  return (
    <div className="flex bg-gray-100 text-black min-h-screen">
      <UserNavbar />
      
      <div className="flex-1 ml-[300px] pt-5 pr-5 bg-gray-100">
        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-700 px-6 py-4 rounded-lg mb-6 border-l-4 border-red-500 shadow-sm">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center mt-16">
            <div className="w-12 h-12 rounded-full border-4 border-[#0fd6a0] border-t-transparent animate-spin"></div>
          </div>
        ) : user ? (
          <>
            {/* User Profile Card */}
            <div className="bg-white rounded-xl p-6 mb-5 shadow-md border border-gray-200">
              <h2 className="text-2xl font-bold mb-8 text-black border-b border-gray-100 pb-4">
                Profile
              </h2>
              
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Profile Picture */}
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#0fd6a0] shadow-md flex-shrink-0">
                  <img
                    src={`http://localhost:5000/uploads/${user.profile_image}`}
                    alt="Profil rasmi"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Info Section */}
                <div className="flex flex-col mt-[30px] space-y-4 text-center md:text-left">
                  <p className="text-2xl font-bold text-black">{user.username}</p>
                  
                 
              
                  
                  <button 
                    onClick={handleEditClick}
                    className="bg-[#0fd6a0] hover:bg-[#0bbe8d] text-black font-medium px-6 py-2 rounded-lg transition-colors duration-200 shadow-sm w-fit"
                  >
                    Edit data
                  </button>
                </div>
              </div>
            </div>
            
            {/* Content area with styled heading */}
            <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
              <div className="border-l-4 border-[#0fd6a0] pl-4 mb-6">
                <h3 className="text-xl font-bold text-black">Personal informations</h3>
                <p className="text-gray-500">User informations</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center py-3 border-b border-gray-100">
                  <p className="font-semibold text-gray-700 w-full md:w-1/3">Username:</p>
                  <p className="text-black w-full md:w-2/3">{user.username}</p>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center py-3 border-b border-gray-100">
                  <p className="font-semibold text-gray-700 w-full md:w-1/3">Email:</p>
                  <p className="text-black w-full md:w-2/3">{user.email}</p>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center py-3">
                  <p className="font-semibold text-gray-700 w-full md:w-1/3">Gender:</p>
                  <p className="text-black w-full md:w-2/3">{user.gender}</p>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default UserPanel;