import React, { useEffect, useState, startTransition, Suspense } from "react";

import { useParams } from "react-router-dom";
import { Heart } from "lucide-react";
import { useGLTF, OrbitControls, Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useNavigate } from 'react-router-dom';


const ProductDetailPage = () => {
   const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [showModel, setShowModel] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Xatolik:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Yuklanmoqda...</div>;
  if (!product) return <div>Mahsulot topilmadi</div>;

  const images = product.image ? JSON.parse(product.image) : [];
  const modelFile = product.model || "";
  console.log("GLB model fayli:", product.model);
  console.log(
    "3D model yo‘li:",
    `http://localhost:5000/uploads/${product.model}`
  );

  const ModelViewer = ({ modelPath }) => {
    const { scene } = useGLTF(modelPath);
    return (
      <Canvas
        camera={{
          position: [0, 0.5, 6],
          fov: 60,
        }}
        style={{
          width: "100%",
          height: "100vh",
        }}
      >
        <ambientLight intensity={1} />
        <Environment preset="sunset" />
        <OrbitControls />
        <primitive object={scene} />
      </Canvas>
    );
  };

  const parsedColors = product.color
    ? product.color.split(",").map((c) => c.trim())
    : [];

  // O'lchamlar
  let parsedSizes = [];
  try {
    if (Array.isArray(product.sizes)) {
      parsedSizes = product.sizes;
    } else if (typeof product.sizes === "string") {
      parsedSizes = JSON.parse(product.sizes);
      if (!Array.isArray(parsedSizes)) {
        parsedSizes = product.sizes.split(",").map((s) => s.trim());
      }
    }
  } catch (error) {
    console.error("Sizes parsing xatosi:", error);
    parsedSizes = [];
  }
  
  const handleOrderClick = () => {
    navigate("/order", { state: { product } });
  };

  return (
    
    <div className="font-poppins  mt-20 mb-20 rounded-xl max-w-7xl mx-auto text-gray-800">
      <div className="border p-4 border-[#9999] shadow-customm rounded-xl">
        <div className="mb-7 flex mt-1 gap-2 items-center">
          <h1 className="bg-codee text-2xl h-7 text-codee rounded">M</h1>

          <h1 className="text-3xl font-semibold">{product.name}</h1>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Chap tomonda: rasmlar va 3D model */}
          <div className="flex w-[70px] lg:flex-col gap-2 max-h-[400px]">
            {images.map((img, i) => (
              <img
                key={i}
                src={`http://localhost:5000/uploads/${img}`}
                alt="preview"
                onClick={() => {
                  setSelectedImage(img);
                  setShowModel(false);
                }}
                className="w-16 h-16 object-cover border hover:border-blue-500 cursor-pointer rounded"
              />
            ))}

            {/* 3D model tugmasi */}
            {modelFile && (
              <div
                onClick={() => {
                  startTransition(() => {
                    setShowModel(true);
                    setSelectedImage(null);
                  });
                }}
                className="w-16 h-16 bg-gray-200 flex items-center justify-center border hover:border-black/20 cursor-pointer rounded text-xs text-black text-center"
              >
                3D
                <br />
                Model
              </div>
            )}

            {/* Modelni yuklash */}
            {showModel && modelFile && (
              <Suspense
                fallback={
                  <div className="w-full h-full flex justify-center items-center">
                    Yuklanmoqda...
                  </div>
                }
              >
                <ModelViewer
                  modelPath={`http://localhost:5000/uploads/${modelFile}`}
                />
              </Suspense>
            )}
          </div>

          {/* O‘rta: asosiy rasm yoki model */}
          <div className="flex-1">
            <div className="relative w-full h-[400px] bg-gray-100 rounded overflow-hidden">
              {showModel && modelFile ? (
                <ModelViewer
                  modelPath={`http://localhost:5000/uploads/${modelFile}`}
                />
              ) : (
                <img
                  src={`http://localhost:5000/uploads/${
                    selectedImage || images[0]
                  }`}
                  alt="Main product"
                  className="w-full h-full  object-cover"
                />
              )}
            </div>
          </div>

          {/* O‘ng: mahsulot tafsilotlari */}
          <div className="w-full lg:w-1/3 space-y-6">
            {/* Ranglar */}
            <div>
              <h3 className="text-sm font-medium">Colors</h3>
              <div className="flex gap-2 mt-2">
                {parsedColors.map((color, i) => {
                  const isSelected = selectedColor === color;
                  return (
                    <div
                      key={i}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded border-2 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "border-black ring-1 ring-black/30"
                          : "border-gray-300 hover:border-gray-600"
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    ></div>
                  );
                })}
              </div>
              {selectedColor && (
                <div className="text-sm text-gray-600 mt-2">
                  Choosen color:{" "}
                  <span className="font-semibold">{selectedColor}</span>
                </div>
              )}
            </div>

            {/* O'lchamlar */}
            <div>
              <h3 className="text-sm font-medium">Size</h3>
              <div className="flex gap-2 mt-2">
                {parsedSizes.map((size, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSize(size)}
                    className={`duration-300 px-3 py-1 text-sm rounded w-12 h-9 border ${
                      selectedSize === size
                        ? "bg-black text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-black hover:text-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Jins */}
            {product.gender && (
              <div className="text-sm font-medium text-gray-600">
                <span className="font-semibold text-1xl p-[1px] text-gray-800 rounded ">
                  For whom: {product.gender}
                </span>
              </div>
            )}

            {/* Narxi */}
            <div>
              <div className="text-2xl font-bold ">{product.price} $</div>
            </div>

            {/* Tugmalar */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button onClick={handleOrderClick} className="duration-300 w-[140px] bg-black text-white px-4 py-2 rounded hover:bg-white hover:border border-black hover:text-black">
                Buy now
              </button>
              <button className="duration-300 w-[140px] border border-black text-gray-800 px-4 py-2 rounded hover:bg-black hover:text-white">
                Add to cart
              </button>
              <button className="p-2 rounded border hover:bg-red-100">
                <Heart size={20} />
              </button>
            </div>

            {/* Qoldiq va sotuv */}
            <div className="flex flex-col sm:flex-row gap-2 text-sm">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded">
                {product.quantity} dona qoldi!
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mahsulot tavsifi */}
      {product.description && (
        <section className="mt-5 border-[#9999] shadow-customm border p-4 rounded-xl">
          <div className="bg-white rounded-xl">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-[5px] border-codee w-[140px]">
              Description
            </h2>
            <p className="text-gray-700 text-[15px] leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
