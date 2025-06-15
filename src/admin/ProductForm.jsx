import React, { useState, useRef } from "react";
import axios from "axios";
import AdminSidebar from "./AdminNavbar";

const sizesList = ["XS", "S", "M", "L", "XL", "XXL"];
const genders = ["Male", "Female", "Unisex"];

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    sizes: [],
    gender: "",
    fabric: "",
    color: "",
    category: "",
    images: [],
    model: null,
  });

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const hiddenFileInput = useRef(null);
  const hiddenModelInput = useRef(null);

  const handleUploadClick = () => {
    hiddenFileInput.current.click();
  };

  const handleModelChange = (e) => {
    setFormData((prev) => ({ ...prev, model: e.target.files[0] }));
  };

  const toggleSize = (size) => {
    setFormData((prev) => {
      const sizes = prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("price", formData.price);
    form.append("quantity", formData.quantity);
    form.append("gender", formData.gender);
    form.append("sizes", JSON.stringify(formData.sizes));
    form.append("fabric", formData.fabric);
    form.append("color", formData.color);
    form.append("category", formData.category);
    formData.images.forEach((img) => form.append("images", img));
    form.append("model", formData.model);

    axios
      .post("http://localhost:5000/api/products", form)
      .then((res) => console.log("Product added:", res.data))
      .catch((err) => console.error("Error:", err));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 ml-[300px] flex flex-col">
        
        
        <div className="flex-1 py-5 pr-5  ">
          <div className=" mx-auto bg-white border-[#c7c2c299] border rounded-xl shadow-customm  p-5">
            <h1 className="text-2xl font-bold mb-5  border-[#9999] pb-2 ">Add product</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form grid layout */}
              <div className="grid  grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-black">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0fd6a0]"
                      value={formData.name}
                      onChange={handleTextChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-black">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows="4"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0fd6a0]"
                      value={formData.description}
                      onChange={handleTextChange}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-black">
                        Price
                      </label>
                      <input
                        type="number"
                        name="price"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0fd6a0]"
                        value={formData.price}
                        onChange={handleTextChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-black">
                        Quantity
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0fd6a0]"
                        value={formData.quantity}
                        onChange={handleTextChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-black">
                      Color
                    </label>
                    <input
                      type="text"
                      name="color"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0fd6a0]"
                      value={formData.color}
                      onChange={handleTextChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-black">
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0fd6a0]"
                      value={formData.category}
                      onChange={handleTextChange}
                      required
                    />
                  </div>
                </div>
                
                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-black">
                      Gender
                    </label>
                    <select
                      name="gender"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0fd6a0]"
                      value={formData.gender}
                      onChange={handleTextChange}
                      required
                    >
                      <option value="">Select gender</option>
                      {genders.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-black">
                      Fabric
                    </label>
                    <input
                      type="text"
                      name="fabric"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0fd6a0]"
                      value={formData.fabric}
                      onChange={handleTextChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-black">
                      Sizes
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {sizesList.map((size) => (
                        <button
                          type="button"
                          key={size}
                          className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                            formData.sizes.includes(size)
                              ? "bg-[#0fd6a0] text-white"
                              : "bg-gray-100 text-black hover:bg-gray-200"
                          }`}
                          onClick={() => toggleSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-black">
                      Images
                    </label>
                    <div
                      onClick={handleUploadClick}
                      className="w-full h-32 border-dashed border-2 border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group"
                    >
                      <div className="text-[#0fd6a0] font-medium group-hover:scale-110 transition-transform">
                        + Upload image
                      </div>
                      <span className="text-xs text-gray-500 mt-1">
                        Click or drop your file here
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                      ref={hiddenFileInput}
                    />
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {formData.images.map((file, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${idx}`}
                            className="w-20 h-20 object-cover rounded shadow-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-black">
                      3D Model (GLB/GLTF)
                    </label>
                    <div
                      onClick={() => hiddenModelInput.current.click()}
                      className="w-full h-32 border-dashed border-2 border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group"
                    >
                      <div className="text-[#0fd6a0] font-medium group-hover:scale-110 transition-transform">
                        {formData.model ? formData.model.name : "+ Upload model"}
                      </div>
                      <span className="text-xs text-gray-500 mt-1">
                        Upload GLB or GLTF files
                      </span>
                    </div>
                    <input
                      type="file"
                      accept=".glb,.gltf"
                      onChange={handleModelChange}
                      className="hidden"
                      ref={hiddenModelInput}
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-[#0fd6a0] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#0ac38e] transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <span className="mr-2">Add Product</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;