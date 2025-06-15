import React from "react";
import { useNavigate } from "react-router-dom";

const AdminProductCard = ({ product, onDelete }) => {
  const navigate = useNavigate();
  if (!product) return null;

  const handleEdit = () => {
    navigate(`/admin/products/edit/${product.id}`);
  };

  // ✅ To‘g‘ri image URL tayyorlash (massiv va string holatni hisobga olib)
  let imageUrl = "";

  try {
    const parsedImage = typeof product.image === "string"
      ? JSON.parse(product.image)
      : product.image;

    imageUrl = `http://localhost:5000/uploads/${
      Array.isArray(parsedImage) ? parsedImage[0] : parsedImage
    }`;
  } catch (error) {
    console.error("AdminCard: Rasmni parse qilishda xatolik:", error);
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="w-full h-[250px] overflow-hidden rounded-t-lg">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col flex-grow justify-between p-4">
        <div>
          <h3 className="text-lg font-semibold text-black text-center">{product.name}</h3>
          <p className="text-black text-center mt-1">{product.price}  $</p>
        </div>

        <div className="mt-4 space-y-2">
          {onDelete && (
            <button
              onClick={() => onDelete(product.id)}
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition duration-200"
            >
              🗑 O‘chirish
            </button>
          )}
          <button
            onClick={handleEdit}
            className="w-full border-2 border-black text-black py-2 rounded-lg hover:bg-black hover:text-white transition duration-200"
          >
            ✏️ Tahrirlash
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProductCard;
