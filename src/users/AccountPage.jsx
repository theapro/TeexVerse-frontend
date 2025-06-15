import React, { useEffect, useState } from "react";
import axios from "axios";

const AccountPage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [form, setForm] = useState({
    username: "",
    gender: "",
    profile_image: null,
  });

  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:5000/auth/account", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data);
          setForm({
            ...form,
            username: res.data.username,
            gender: res.data.gender,
          });
        })
        .catch((err) => {
          setMessage("Xatolik yuz berdi");
        });
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, profile_image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("username", form.username);
    data.append("gender", form.gender);
    if (form.profile_image) {
      data.append("profile_image", form.profile_image);
    }
    console.log('Profil rasmi:', user.profile_image);

    try {
      await axios.put("http://localhost:5000/auth/account", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Ma'lumotlar yangilandi");
    } catch (err) {
      setMessage("Xatolik yuz berdi");
    }
  };

  if (!user) return <p className="text-center mt-10">Yuklanmoqda...</p>;

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <div className="flex items-center gap-4">
            <img
              src={`http://localhost:5000/auth/uploads/${user.profile_image}`}
              onError={(e) =>
                (e.target.src = "../../../backend/uploadspfp/defaultimg.jpg")
              }
              className="w-16 h-16 rounded-full border"
              alt="Avatar"
            />

            <div>
              <h2 className="text-xl font-semibold">{user.username}</h2>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default AccountPage;
