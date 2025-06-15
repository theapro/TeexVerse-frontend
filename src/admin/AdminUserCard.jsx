import React, { useState, useEffect, useRef } from "react";

const AdminUserCard = ({ user, onDeleteUser }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const cardRef = useRef(null);
  
  const handleCardClick = () => {
    setShowOptions(!showOptions);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevents the card click event from firing
    setIsDeleting(true);
  };

  // Handle clicks outside the card component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setShowOptions(false);
        setIsDeleting(false);
      }
    };

    // Add event listener when options or delete dialog is shown
    if (showOptions || isDeleting) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Clean up the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOptions, isDeleting]);

  const confirmDelete = async (e) => {
    e.stopPropagation(); // Prevents the card click event from firing
    
    // Check if user ID exists
    if (!user.id && !user._id) {
      console.error('User ID is missing', user);
      alert('Foydalanuvchi ID topilmadi');
      setIsDeleting(false);
      return;
    }
    
    // Use either id or _id property depending on your API structure
    const userId = user.id || user._id;
    
    try {
    
      
      // Send delete request to the backend
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server error details:', errorData);
        throw new Error(`Failed to delete user (Status: ${response.status})`);
      }
      
      // Call the parent component's handler to update the UI
      if (onDeleteUser) {
        onDeleteUser(userId);
      }
      
      setIsDeleting(false);
      setShowOptions(false);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(`User o'chirishda xatolik: ${error.message}`);
      setIsDeleting(false);
    }
  };

  const cancelDelete = (e) => {
    e.stopPropagation(); // Prevents the card click event from firing
    setIsDeleting(false);
  };

  return (
    <div className="relative" ref={cardRef}>
      {/* Options menu that appears when card is clicked */}
      {showOptions && !isDeleting && (
       <div className="absolute z-10 bg-black/30 backdrop-blur-md shadow-lg h-[150px] rounded-xl border border-white/20 p-1 w-full bottom-full mb-[-150px]">

          <div className="flex flex-col space-y-2">
            <button 
              className="flex items-center text-left px-3 py-2 text-white hover:bg-gray-100/20 rounded transition-colors "
              onClick={handleDeleteClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete User
            </button>
            <button 
              className="flex items-center text-left px-3 py-2 text-white hover:bg-gray-100/20 rounded transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit User
            </button>
            <button 
              className="flex items-center text-left px-3 py-2 text-white  hover:bg-gray-100/20 rounded transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Details
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      {isDeleting && (
        <div className="absolute z-10 bg-black/30 backdrop-blur-md shadow-lg h-[150px] rounded-xl border border-white/20 p-4 w-full bottom-full mb-[-150px]">
          <h4 className="font-medium text-white mb-3">Are you really delete it?</h4>
          <p className="text-sm text-white mb-4">You cannot restore again.</p>
          <div className="flex space-x-3 justify-end">
            <button 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              onClick={cancelDelete}
            >
              Cancel
            </button>
            <button 
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              onClick={confirmDelete}
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Card component */}
      <div 
        className={`bg-white rounded-xl flex overflow-hidden shadow-md hover:shadow-lg transition duration-300 border border-gray-200 cursor-pointer ${isDeleting ? 'opacity-75' : ''}`}
        onClick={handleCardClick}
      >
        {/* Card header with user profile image - left side */}
        <div className="bg-codee/30 p-6 flex items-center justify-center w-1/3">
          {user.profile_image ? (
            <img 
              src={`http://localhost:5000/uploads/${user.profile_image}`}
              alt={`${user.username}'s profile`} 
              className="h-24 w-24 object-cover rounded-full border-4 border-white shadow"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-black text-xl font-bold border-4 border-white shadow">
              {user.username?.charAt(0).toUpperCase() || "?"}
            </div>
          )}
        </div>
        
        {/* Card content - right side */}
        <div className="p-6 w-2/3">
          <h3 className="text-xl font-semibold mb-4  text-black">{user.username}</h3>
          
          <div className="space-y-4">
            <div className="flex items-center text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm truncate">{user.email}</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm">{user.gender === "male" ? "Male" : user.gender === "female" ? "Female" : "Undefined"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserCard;