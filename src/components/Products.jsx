import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Search,
  Loader2,
  ChevronDown,
  Grid,
  List,
  X,
  Sliders,
} from "lucide-react";
import axios from "axios";
import ProductCard from "./ProductCard";
import ProductRecommendations from "./ProductRecomendations";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(true);

  // Mock categories - replace with your actual categories
  const categories = [
    "all",
    "furniture",
    "lighting",
    "decor",
    "kitchen",
    "accessories",
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  // Filter products based on search term and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = category === "all" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  // Sort products based on selected option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "priceLow") return a.price - b.price;
    if (sortBy === "priceHigh") return b.price - a.price;
    if (sortBy === "newest")
      return new Date(b.createdAt) - new Date(a.createdAt);
    return 0; // default/featured
  });

  const resetFilters = () => {
    setSearchTerm("");
    setCategory("all");
    setSortBy("featured");
  };

  return (
    <section id="products" className="py-16 bg-gray-50">
      {/* Main Products Section */}
      <div className="container mx-auto px-4 sm:px-8 lg:px-16 xl:px-20 2xl:px-24">
        <div className="shadow-customm bg-white rounded-xl p-6 md:p-10 border border-gray-100">
          {/* Premium Header with animated underline */}
          <div className="mb-10 md:mb-16 text-center">
            <span className="inline-block text-[#0fd6a0] font-medium mb-2 tracking-wider text-sm uppercase">
              Collection
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Exclusive Products
            </h2>
            <div className="relative h-1 w-16 bg-[#0fd6a0] mx-auto rounded mb-6">
              <div className="absolute top-0 left-0 h-full w-1/2 bg-white/20 animate-pulse"></div>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Discover our meticulously crafted collection, where quality meets
              design excellence and functionality
            </p>
          </div>

          {/* Filters toolbar */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            {/* Enhanced Search bar - Now more prominent */}
            <div className="">
              <div className="relative max-w-3xl mx-auto">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search for products by name, material, or style..."
                  className="pl-12 pr-4 py-4 w-full md:w-[970px] border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#0fd6a0] focus:border-[#0fd6a0] transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center ">
              {/* Sort dropdown */}
              <div className="relative">
                <select
                  className="appearance-none h-[57px] bg-white border ml-[10px] border-gray-200 rounded-xl shadow-sm pl-4 pr-10 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0fd6a0] focus:border-[#0fd6a0]"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest First</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
              </div>

              {/* View toggle */}
              <div className="hidden h-[57px] w-[80px] md:flex items-center p-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-white text-[#0fd6a0] shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-white text-[#0fd6a0] shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  aria-label="List view"
                >
                  <List className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile filter button */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="md:hidden flex items-center gap-2 p-2 bg-gray-100 rounded-lg"
              >
                <Sliders className="h-4 w-4 text-gray-700" />
                <span className="text-sm font-medium">Filters</span>
              </button>
            </div>
          </div>

          {/* Mobile filters modal */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end md:hidden">
              <div
                id="mobile-filters"
                className="bg-white rounded-t-xl w-full p-5 transform transition-transform duration-300 animate-slide-up"
              >
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1 rounded-full hover:bg-gray-100"
                    aria-label="Close filters"
                  >
                    <X className="h-6 w-6 text-gray-500" />
                  </button>
                </div>

                {/* Category */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          category === cat
                            ? "bg-[#0fd6a0] text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {cat === "all"
                          ? "All"
                          : cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort by */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort by
                  </label>
                  <select
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0fd6a0] focus:border-[#0fd6a0]"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest First</option>
                    <option value="priceLow">Price: Low to High</option>
                    <option value="priceHigh">Price: High to Low</option>
                  </select>
                </div>

                {/* View Mode */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    View
                  </label>
                  <div className="flex p-1 bg-gray-100 rounded-lg">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`flex-1 p-2 rounded-md transition-colors ${
                        viewMode === "grid"
                          ? "bg-white text-[#0fd6a0] shadow-sm"
                          : "text-gray-500"
                      }`}
                    >
                      <div className="flex justify-center items-center">
                        <Grid className="h-4 w-4 mr-2" />
                        <span>Grid</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`flex-1 p-2 rounded-md transition-colors ${
                        viewMode === "list"
                          ? "bg-white text-[#0fd6a0] shadow-sm"
                          : "text-gray-500"
                      }`}
                    >
                      <div className="flex justify-center items-center">
                        <List className="h-4 w-4 mr-2" />
                        <span>List</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      resetFilters();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileFilterOpen(false);
                    }}
                    className="flex-1 px-4 py-2 bg-[#0fd6a0] text-white rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results count & active filters */}
          {!loading && (
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-gray-600 font-medium">
                  {sortedProducts.length}{" "}
                  {sortedProducts.length === 1 ? "product" : "products"}
                </span>

                {/* Active filters pills */}
                <div className="flex flex-wrap gap-2">
                  {category !== "all" && (
                    <div className="bg-[#0fd6a0] bg-opacity-10 text-[#0fd6a0] text-sm py-1 px-3 rounded-full flex items-center gap-1">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                      <button
                        onClick={() => setCategory("all")}
                        className="ml-1 hover:bg-[#0fd6a0] hover:bg-opacity-20 rounded-full"
                        aria-label={`Remove ${category} filter`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}

                  {searchTerm && (
                    <div className="bg-[#0fd6a0] bg-opacity-10 text-[#0fd6a0] text-sm py-1 px-3 rounded-full flex items-center gap-1">
                      "{searchTerm}"
                      <button
                        onClick={() => setSearchTerm("")}
                        className="ml-1 hover:bg-[#0fd6a0] hover:bg-opacity-20 rounded-full"
                        aria-label="Clear search"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}

                  {(category !== "all" || searchTerm) && (
                    <button
                      onClick={resetFilters}
                      className="text-sm text-gray-500 hover:text-[#0fd6a0] transition-colors"
                      aria-label="Clear all filters"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-gray-100">
                  <div className="h-16 w-16 rounded-full border-t-4 border-[#0fd6a0] animate-spin absolute top-0 left-0"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-[#0fd6a0]" />
                </div>
              </div>
              <p className="mt-6 text-gray-800 text-lg font-medium">
                Loading collection...
              </p>
              <p className="text-gray-500">
                Please wait while we prepare our finest products for you
              </p>
            </div>
          ) : (
            <>
              {/* Product grid with staggered animation */}
              {sortedProducts.length > 0 ? (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid gap-6 sm:gap-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      : "space-y-6"
                  }
                >
                  {sortedProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className={`transform transition duration-300 ease-out ${
                        viewMode === "grid"
                          ? "hover:-translate-y-1 hover:"
                          : "hover:"
                      }`}
                      style={{
                        animationDelay: `${index * 0.05}s`,
                        opacity: 0,
                        animation: "fadeInUp 0.5s ease-out forwards",
                      }}
                    >
                      <ProductCard
                        product={product}
                        viewMode={viewMode}
                        accentColor="#0fd6a0"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12 text-center my-8">
                  <div className="mx-auto w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    We couldn't find any products matching your current filters.
                    Try adjusting your search or browse our full collection.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-6 py-3 bg-[#0fd6a0] text-white rounded-lg hover:bg-opacity-90 transition-colors inline-flex items-center shadow-sm"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Render our standalone recommendations component */}
        {showRecommendations && (
          <ProductRecommendations 
            products={products} 
            loading={loading} 
            accentColor="#0fd6a0" 
          />
        )}
      </div>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default Products;  