import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminProductCard from "./AdminProductCard";
import AdminSidebar from "./AdminNavbar";

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Mahsulotlar olinganda xato:", error);
        setLoading(false);
      });
  }, []);

  const handleDelete = (productId) => {
    axios
      .delete(`http://localhost:5000/api/products/${productId}`)
      .then(() => {
        setProducts(products.filter((product) => product.id !== productId));
      })
      .catch((error) => {
        console.error("Mahsulotni o‘chirishda xato:", error);
      });
  };

  return (
    <>
      <AdminSidebar />
      <div className="ml-[300px] border-gray-300 border bg-white shadow-customm mb-[20px] rounded-xl mt-[20px] mr-[20px] min-h-screen p-6">
        <h2 className="text-2xl font-bold border-b border-black/30 pb-1 mb-6">Products</h2>
        {loading ? (
          <p>Yuklanmoqda...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">            {products.length > 0 ? (
              products.map((product) => (
                <AdminProductCard
                  key={product.id}
                  product={product}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <p>Hozircha mahsulotlar mavjud emas.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminPanel;
