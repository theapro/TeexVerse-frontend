import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar"

const sizesList = ["XS", "S", "M", "L", "XL", "XXL"];
const genders = ["Erkak", "Ayol", "Uniseks"];

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    sizes: [],
    gender: '',
    fabric: '',
    color: '',
    category: '',
    images: [],
    model: null,
  });

  const hiddenImageInput = useRef(null);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/products/${id}`).then((res) => {
        const data = res.data;
        setFormData({
          name: data.name,
          description: data.description,
          price: data.price,
          quantity: data.quantity,
          gender: data.gender,
          fabric: data.fabric,
          sizes: JSON.parse(data.sizes || "[]"),
          images: [],
          model: null,
          color: data.color,
          category: data.category, 
        });
      });
    }
  }, [id]);

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSize = (size) => {
    setFormData((prev) => {
      const sizes = prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes };
    });
  };

  const handleImageUploadClick = () => {
    hiddenImageInput.current.click();
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      images: Array.from(e.target.files),
    }));
  };
  
  const handleModelChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      model: e.target.files[0],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("name", formData.name);
    formDataToSubmit.append("description", formData.description);
    formDataToSubmit.append("price", formData.price);
    formDataToSubmit.append("quantity", formData.quantity);
    formDataToSubmit.append("sizes", JSON.stringify(formData.sizes));
    formDataToSubmit.append("fabric", formData.fabric);
    formDataToSubmit.append("gender", formData.gender);
    formDataToSubmit.append("color", formData.color);
    formDataToSubmit.append("category", formData.category);
  
    if (formData.images) {
      formData.images.forEach((image) => formDataToSubmit.append("images", image));
    }
  
    if (formData.model) {
      formDataToSubmit.append("model", formData.model);
    }
  
    try {
      const response = await axios.put(`http://localhost:5000/api/products/${id}`, formDataToSubmit);
      console.log(response.data);
      navigate(`/admin/products`);
    } catch (error) {
      console.error("Update xatoligi:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <>
    <AdminNavbar/>
    <div className="min-h-screen ml-[300px]  py-5 pr-5">
      <div className=" mx-auto bg-white rounded-2xl shadow-customm border border-[#e3dfdf] overflow-hidden">
        <div className="flex flex-col md:flex-row">
         

          
          <div className="p-8 w-full">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info Section */}
                <div className="col-span-2">
                  <h3 className="text-xl font-semibold mb-4 border-b-2 border-[#0fd6a0] pb-2 inline-block">
                    Edit product
                  </h3>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Product name</label>
                  <input
                    type="text"
                    name="name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0fd6a0] focus:border-transparent transition"
                    value={formData.name}
                    onChange={handleTextChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Price</label>
                  <input
                    type="number"
                    name="price"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0fd6a0] focus:border-transparent transition"
                    value={formData.price}
                    onChange={handleTextChange}
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Comment</label>
                  <textarea
                    name="description"
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0fd6a0] focus:border-transparent transition"
                    value={formData.description}
                    onChange={handleTextChange}
                    required
                  ></textarea>
                </div>

                {/* Details Section */}
                <div className="col-span-2 mt-4">
                  <h3 className="text-xl font-semibold mb-4 border-b-2 border-[#0fd6a0] pb-2 inline-block">
                    Additional informations
                  </h3>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0fd6a0] focus:border-transparent transition"
                    value={formData.quantity}
                    onChange={handleTextChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Fabric</label>
                  <input
                    type="text"
                    name="fabric"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0fd6a0] focus:border-transparent transition"
                    value={formData.fabric}
                    onChange={handleTextChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Color</label>
                  <input
                    type="text"
                    name="color"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0fd6a0] focus:border-transparent transition"
                    value={formData.color}
                    onChange={handleTextChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Category</label>
                  <input
                    type="text"
                    name="category"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0fd6a0] focus:border-transparent transition"
                    value={formData.category}
                    onChange={handleTextChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Gender</label>
                  <select
                    name="gender"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0fd6a0] focus:border-transparent transition appearance-none bg-white"
                    value={formData.gender}
                    onChange={handleTextChange}
                    required
                  >
                    <option value="">Tanlang</option>
                    {genders.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2 text-gray-700">Sizes</label>
                  <div className="flex flex-wrap gap-2">
                    {sizesList.map((size) => (
                      <button
                        type="button"
                        key={size}
                        className={`px-5 py-2 rounded-lg transition-all duration-200 font-medium ${
                          formData.sizes.includes(size) 
                            ? "bg-[#0fd6a0] text-black border-2 border-[#0fd6a0]" 
                            : "bg-white text-black border-2 border-gray-300 hover:border-[#0fd6a0]"
                        }`}
                        onClick={() => toggleSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Media Section */}
                <div className="col-span-2 mt-4">
                  <h3 className="text-xl font-semibold mb-4 border-b-2 border-[#0fd6a0] pb-2 inline-block">
                    Media
                  </h3>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2 text-gray-700">Add images</label>
                  <div
                    onClick={handleImageUploadClick}
                    className="w-full h-40 border-dashed border-2 border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#0fd6a0] transition group"
                  >
                    <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#0fd6a0]/10 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 group-hover:text-[#0fd6a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <span className="text-gray-600 mt-2 group-hover:text-[#0fd6a0]">Upload images</span>
                    <span className="text-xs text-gray-400 mt-1">(Click upload or drop files)</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    ref={hiddenImageInput}
                  />
                  <div className="flex gap-3 mt-4 flex-wrap">
                    {formData.images.map((file, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${idx}`}
                          className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <div className="absolute inset-0 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            type="button" 
                            className="text-white hover:text-[#0fd6a0]"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                images: prev.images.filter((_, i) => i !== idx)
                              }));
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2 text-gray-700">Upload 3D Model (GLB/GLTF)</label>
                  <div
                    onClick={() => document.getElementById('model-upload').click()}
                    className="w-full h-40 border-dashed border-2 border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#0fd6a0] transition group"
                  >
                    <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#0fd6a0]/10 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 group-hover:text-[#0fd6a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-gray-600 mt-2 group-hover:text-[#0fd6a0]">Upload 3D model</span>
                    <span className="text-xs text-gray-400 mt-1">(Upload GLB/GLTF files)</span>
                  </div>
                  <input
                    id="model-upload"
                    type="file"
                    accept=".glb,.gltf"
                    onChange={handleModelChange}
                    className="hidden"
                  />
                  {formData.model && (
                    <div className="mt-4 flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="w-10 h-10 rounded-lg bg-[#0fd6a0]/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0fd6a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" />
                        </svg>
                      </div>
                      <div className="flex-grow">
                        <div className="font-medium text-gray-700">{formData.model.name}</div>
                        <div className="text-xs text-gray-500">{Math.round(formData.model.size / 1024)} KB</div>
                      </div>
                      <button 
                        type="button"
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => setFormData(prev => ({ ...prev, model: null }))}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/admin/products')}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition shadow-md hover:shadow-lg flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Submit edit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default EditProduct;