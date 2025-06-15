import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminNavbar";
import UserCard from "./AdminUserCard";
import { RefreshCw, Search, PlusCircle, X, Upload, UserPlus, Filter } from "lucide-react";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("username");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterGender, setFilterGender] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    gender: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 6,
  });

  // Define theme colors
  const themeColors = {
    primary: "#0fd6a0", // Your requested color
    black: "#000000",
    white: "#ffffff",
    gray: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      filterAndSortUsers();
    }
  }, [searchTerm, users, sortBy, sortOrder, filterGender, pagination.currentPage]);

  const filterAndSortUsers = () => {
    // Filter
    let result = users.filter(
      (user) =>
        ((user.username || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
         (user.email || "").toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterGender === "" || user.gender === filterGender)
    );
    
    // Sort
    result.sort((a, b) => {
      const valueA = (a[sortBy] || "").toLowerCase();
      const valueB = (b[sortBy] || "").toLowerCase();
      
      if (sortOrder === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
    
    setFilteredUsers(result);
  };

  // Calculate pagination
  const indexOfLastItem = pagination.currentPage * pagination.itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - pagination.itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / pagination.itemsPerPage);

  const fetchUsers = () => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/users")
      .then((response) => {
        setUsers(response.data);
        setFilteredUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Foydalanuvchilarni olishda xatolik:", error);
        setError("Ma'lumotlarni yuklashda xatolik yuz berdi");
        setLoading(false);
      });
  };

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPagination({...pagination, currentPage: 1}); // Reset to first page on search
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddUser = async () => {
    if (!newUser.username || !newUser.email || !newUser.password) {
      setError("Username, email va password majburiy");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", newUser.username);
      formData.append("email", newUser.email);
      formData.append("password", newUser.password);
      formData.append("gender", newUser.gender || "");
      if (profileImage) {
        formData.append("profile_image", profileImage);
      }

      setLoading(true);
      setError(null);
      const response = await axios.post("http://localhost:5000/api/users", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Add the new user to the users array (with the response data including ID)
      setUsers(prevUsers => [response.data, ...prevUsers]);
      
      // Show success message
      setSuccessMessage(`Foydalanuvchi ${newUser.username} muvaffaqiyatli qo'shildi!`);
      setTimeout(() => setSuccessMessage(""), 5000); // Clear after 5 seconds
      
      setShowModal(false);
      setNewUser({ username: "", email: "", password: "", gender: "" });
      setProfileImage(null);
      setImagePreview(null);
      setLoading(false);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      setLoading(false);
      console.error("Foydalanuvchini qo'shishda xatolik:", error);
      setError(
        error.response?.data?.error || 
        error.response?.data?.details || 
        "Foydalanuvchini qo'shishda xatolik yuz berdi"
      );
    }
  };

  // Modal oynani yopish uchun
  const closeModal = () => {
    setShowModal(false);
    setNewUser({ username: "", email: "", password: "", gender: "" });
    setProfileImage(null);
    setImagePreview(null);
    setError(null);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setPagination({...pagination, currentPage: 1}); // Reset to first page on sort
  };

  const handlePageChange = (page) => {
    setPagination({...pagination, currentPage: page});
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4" style={{ borderColor: themeColors.primary }}></div>
        <p className="mt-4 text-gray-600">Ma'lumotlar yuklanmoqda...</p>
      </div>
    </div>
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />
      <div className="ml-[300px] w-full py-5 pr-5">
        <div className="bg-white p-6 rounded-xl shadow-customm border border-[#dcd3d399]">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Users management</h2>
              <p className="text-gray-500 mt-1">Total {users.length} users</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              {/* Search input */}
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-4 h-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  className="block w-full p-2.5 pl-10 text-sm border h-[45px] border-gray-300 rounded-lg bg-white focus:ring-2 focus:outline-none focus:ring-opacity-50"
                  style={{ focusRing: themeColors.primary }}
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              
              {/* Filter dropdown */}
              <div className="relative w-full md:w-auto">
                <select
                  className="block w-full p-2.5 text-sm border  h-[45px] border-gray-300 rounded-lg bg-white focus:ring-2 focus:outline-none focus:ring-opacity-50 appearance-none pr-10"
                  style={{ focusRing: themeColors.primary }}
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value)}
                >
                  <option value="">All genders</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Filter className="w-4 h-4 text-gray-500" />
                </div>
              </div>
              
              {/* Refresh button */}
              <button 
                onClick={fetchUsers}
                className="p-2.5 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition flex items-center justify-center w-full md:w-auto"
                title="Yangilash"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
              
              {/* Add user button */}
              <button 
                onClick={() => setShowModal(true)}
                className="px-4 py-2.5 text-black rounded-md transition flex items-center justify-center w-full md:w-auto"
                style={{ backgroundColor: themeColors.primary }}
              >
                <UserPlus className="h-5 w-5 mr-2" />
                New user
              </button>
            </div>
          </div>

          {/* Success message */}
          {successMessage && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded animate-fadeIn">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{successMessage}</p>
                </div>
                <button 
                  onClick={() => setSuccessMessage("")}
                  className="ml-auto text-green-500 hover:text-green-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded animate-fadeIn">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
                <button 
                  onClick={() => setError(null)}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Sort controls */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-gray-600 text-sm py-1">Filter by :</span>
            <button
              className={`px-3 py-1 text-sm rounded-full transition ${sortBy === "username" ? 'text-black' : 'text-gray-600'}`}
              style={{ backgroundColor: sortBy === "username" ? themeColors.primary : '#f3f4f6' }}
              onClick={() => handleSort("username")}
            >
              Username {sortBy === "username" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-full transition ${sortBy === "email" ? 'text-black' : 'text-gray-600'}`}
              style={{ backgroundColor: sortBy === "email" ? themeColors.primary : '#f3f4f6' }}
              onClick={() => handleSort("email")}
            >
              Email {sortBy === "email" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-full transition ${sortBy === "gender" ? 'text-black' : 'text-gray-600'}`}
              style={{ backgroundColor: sortBy === "gender" ? themeColors.primary : '#f3f4f6' }}
              onClick={() => handleSort("gender")}
            >
              Gender {sortBy === "gender" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: themeColors.primary }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <p className="text-gray-500 text-lg font-medium">
                {searchTerm || filterGender ? "Qidiruv natijasi topilmadi" : "Hozircha foydalanuvchilar yo'q"}
              </p>
              {(searchTerm || filterGender) && (
                <div className="mt-3">
                  <p className="text-gray-400 mb-3">Boshqa parametrlar bilan qidirib ko'ring</p>
                  <button 
                    onClick={() => {
                      setSearchTerm("");
                      setFilterGender("");
                    }}
                    className="px-4 py-2 text-black rounded-md transition focus:outline-none"
                    style={{ backgroundColor: themeColors.primary }}
                  >
                    Filterni tozalash
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentItems.map((user) => (
                  <UserCard key={user.id} user={user} themeColors={themeColors} onRefresh={fetchUsers} />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="inline-flex rounded-md shadow">
                    <button
                      onClick={() => handlePageChange(Math.max(1, pagination.currentPage - 1))}
                      disabled={pagination.currentPage === 1}
                      className={`px-4 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${pagination.currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                    >
                      Oldingi
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-4 py-2 border-t border-b border-gray-300 text-sm font-medium ${pagination.currentPage === i + 1 ? 'bg-gray-100 text-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        style={pagination.currentPage === i + 1 ? {backgroundColor: themeColors.primary} : {}}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(Math.min(totalPages, pagination.currentPage + 1))}
                      disabled={pagination.currentPage === totalPages}
                      className={`px-4 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${pagination.currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                    >
                      Keyingi
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Yangi foydalanuvchi qo'shish modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-lg shadow-xl  w-full max-w-md animate-fade-in">

            <div className="px-6 py-4 border-b rounded-md border-gray-200 flex justify-between items-center" style={{ backgroundColor: themeColors.primary }}>
              <h3 className="text-xl font-bold text-black">Add new user</h3>
              <button onClick={closeModal} className="text-black hover:text-gray-700 focus:outline-none">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Profile image upload with preview */}
              <div className="flex justify-center">
                <div className="relative">
                  <div 
                    className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2"
                    style={{ borderColor: themeColors.primary }}
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                  <label 
                    htmlFor="profile_image_upload" 
                    className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md cursor-pointer"
                    style={{ color: themeColors.primary }}
                  >
                    <Upload className="w-5 h-5" />
                  </label>
                  <input 
                    id="profile_image_upload"
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="username">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="Enter usernmame"
                  value={newUser.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ focusRing: themeColors.primary }}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ focusRing: themeColors.primary }}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="password">
                  Parol <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ focusRing: themeColors.primary }}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="gender">
                  Gender
                </label>
                <select 
                  id="gender"
                  name="gender" 
                  value={newUser.gender} 
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ focusRing: themeColors.primary }}
                >
                  <option value="">Your gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              
              <div className="text-xs text-gray-500">
                <span className="text-red-500">*</span> equired fields
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3 rounded-b-lg">
              <button 
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition focus:outline-none"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddUser}
                className="px-4 py-2 text-black rounded-md transition focus:outline-none"
                style={{ backgroundColor: themeColors.primary }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;