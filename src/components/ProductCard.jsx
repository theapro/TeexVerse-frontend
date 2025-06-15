import React, { useState, useEffect } from "react";
import { ShoppingCart, CreditCard, Heart, Share2, ChevronLeft, ChevronRight } from "lucide-react"; 
import { Link } from "react-router-dom"; 

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  useEffect(() => {
    if (product && product.image) {
      try {
        // Parse the image data from the product
        const parsedImages = typeof product.image === "string"
          ? JSON.parse(product.image)
          : product.image;
        
        // Convert to array if it's not already
        const imageArray = Array.isArray(parsedImages) ? parsedImages : [parsedImages];
        
        // Create full URLs for all images
        const imageUrls = imageArray.map(img => 
          `http://localhost:5000/uploads/${img}`
        );
        
        setImages(imageUrls);
      } catch (error) {
        console.error("Error parsing product images:", error);
        setImages([]);
      }
    }
  }, [product]);
  
  if (!product) return null;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    
  };
  
  const handleBuyNow = (e) => {
    e.stopPropagation();
    
  };
  
  const handleWishlist = (e) => {
    e.stopPropagation();
    
  };
  
  const handleShare = (e) => {
    e.stopPropagation();
    console.log("Sharing product:", product);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevImage = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const capitalize = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  // Check if product is on sale (example condition)
  const isOnSale = product.price < (product.originalPrice || product.price * 1.2);

  return (
    <div 
      className="bg-white rounded-lg shadow-custom2 overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-customm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Slider Container */}
      <div className="relative h-64">
        <Link to={`/product/${product.id}`} className="block h-full">
          {/* Images */}
          <div className="relative h-full overflow-hidden">
            {images.length > 0 ? (
              <img
                src={images[currentImageIndex] || "/placeholder.jpg"}
                alt={`${product.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                onError={(e) => {e.target.src = "/placeholder.jpg"}}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                No Image Available
              </div>
            )}
          </div>
          
          {/* Navigation Arrows - Show when hovered or has multiple images */}
          {images.length > 1 && (
            <div className={`absolute inset-0 flex items-center justify-between px-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <button 
                onClick={prevImage}
                className="bg-white bg-opacity-70 rounded-full p-1 hover:bg-opacity-100 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={nextImage}
                className="bg-white bg-opacity-70 rounded-full p-1 hover:bg-opacity-100 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
          
          {/* Image Counter Badge */}
          {images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
              {currentImageIndex + 1}/{images.length}
            </div>
          )}
          
          {/* Action Buttons Overlay */}
          <div className={`absolute top-2 right-2 flex gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button 
              onClick={handleWishlist}
              className="bg-white p-2 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm"
            >
              <Heart size={16} />
            </button>
            <button 
              onClick={handleShare}
              className="bg-white p-2 rounded-full hover:bg-blue-50 hover:text-blue-500 transition-colors shadow-sm"
            >
              <Share2 size={16} />
            </button>
          </div>
        </Link>
        
       
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <div className="text-xs text-gray-500 mb-1">
          {product.category || "Uncategorized"}
        </div>
        
        {/* Title */}
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="font-bold text-gray-800 hover:text-blue-600 transition-colors truncate">
            {capitalize(product.name)}
          </h3>
        </Link>
        
        {/* Price */}
        <div className="mt-2 flex items-center">
          <span className="text-lg font-bold text-gray-900">
            {product.price?.toLocaleString() || '0'} $
          </span>
          
          {isOnSale && (
            <span className="ml-2 text-sm text-gray-500 line-through">
              {product.originalPrice?.toLocaleString() || Math.round(product.price * 1.2).toLocaleString()} $
            </span>
          )}
        </div>
        
        {/* Rating - Sample implementation */}
        <div className="flex items-center mt-1">
          <div className="flex text-yellow-400">
            {"★".repeat(Math.floor(product.rating || 4))}
            {"☆".repeat(5 - Math.floor(product.rating || 4))}
          </div>
          <span className="text-xs text-gray-500 ml-1">
            ({product.reviewCount || 12})
          </span>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={handleBuyNow}
            className="bg-black text-white py-2 px-3 rounded-lg flex items-center justify-center gap-1 hover:bg-gray-800 transition"
          >
            <CreditCard size={16} />
            <span className="text-sm font-medium">Buy Now</span>
          </button>
          
          <button
            onClick={handleAddToCart}
            className="bg-white text-black py-2 px-3 rounded-lg border border-black flex items-center justify-center gap-1 hover:bg-black hover:text-white transition"
          >
            <ShoppingCart size={16} />
            <span className="text-sm font-medium">Add to Cart</span>
          </button>
        </div>
        
        {/* Image Slider Dots - Alternative Navigation */}
       
      </div>
    </div>
  );
};

export default ProductCard;