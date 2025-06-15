import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

const ProductRecommendations = ({ products = [], accentColor = "#0fd6a0" }) => {
  // For recommendations carousel
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const carouselRef = useRef(null);

  // Get recommended products
  const recommendedProducts = products.slice(0, 6);

  // Recommendation carousel scroll handlers
  const checkScrollPosition = () => {
    if (!carouselRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scrollLeft = () => {
    if (!carouselRef.current) return;
    const scrollAmount = carouselRef.current.clientWidth * 0.75;
    carouselRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (!carouselRef.current) return;
    const scrollAmount = carouselRef.current.clientWidth * 0.75;
    carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // Update arrows visibility on scroll or resize
  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("scroll", checkScrollPosition);
      window.addEventListener("resize", checkScrollPosition);

      // Initial check
      checkScrollPosition();

      return () => {
        carousel.removeEventListener("scroll", checkScrollPosition);
        window.removeEventListener("resize", checkScrollPosition);
      };
    }
  }, []);

  // If there are no products, don't render anything
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 bg-white rounded-xl shadow-customm border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center justify-between">
        <span>Recommended Products</span>
        <span className="text-sm font-medium text-gray-500">View all</span>
      </h2>

      {/* Interactive product carousel */}
      <div className="relative">
        {/* Left scroll arrow */}
        {showLeftArrow && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 bg-white rounded-full  text-gray-700 hover:text-[#0fd6a0] transition-colors border border-gray-200"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        {/* Carousel container */}
        <div
          ref={carouselRef}
          className="flex overflow-x-auto scrollbar-hide pb-4 gap-6"
        >
          {recommendedProducts.map((product, index) => (
            <div
              key={`recommendation-${product.id || index}`}
              className="flex-shrink-0 w-64 flex-grow-0 flex-basis-64"
            >
              <div className="bg-white rounded-xl overflow-hidden   transition-shadow">
                <div className="p-2">
                  <ProductCard
                    product={product}
                    viewMode="compact"
                    accentColor={accentColor}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right scroll arrow */}
        {showRightArrow && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 bg-white rounded-full shadow-lg p-2 text-gray-700 hover:text-[#0fd6a0] transition-colors border border-gray-200"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ProductRecommendations;