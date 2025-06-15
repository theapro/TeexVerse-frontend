import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";
import {
  MapPin,
  Package,
  Phone,
  CheckCircle,
  User,
  CreditCard,
  AlertCircle,
  Home,
  Percent,
} from "lucide-react";

function OrderPage() {
  const location = useLocation();
  const { product } = location.state || {};
  const { user } = useAuth();

  const [orderForm, setOrderForm] = useState({
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    paymentMethod: "card",
    notes: "",
    promoCode: "",
  });
  const [mapPosition, setMapPosition] = useState({
    lat: 41.2995,
    lng: 69.2401,
  }); // Default: Tashkent
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [isCheckingPromo, setIsCheckingPromo] = useState(false);
  const [promoMessage, setPromoMessage] = useState({ type: "", message: "" });
  const [mapLoaded, setMapLoaded] = useState(false);
  const [yandexMap, setYandexMap] = useState(null);

  // Load Yandex Maps
  useEffect(() => {
    const loadYandexMaps = () => {
      const script = document.createElement("script");
      script.src =
        "https://api-maps.yandex.ru/2.1/?apikey=YOUR_YANDEX_API_KEY&lang=ru_RU";
      script.async = true;
      script.onload = initializeYandexMap;
      document.body.appendChild(script);
    };

    loadYandexMaps();

    return () => {
      if (yandexMap) {
        yandexMap.destroy();
      }
    };
  }, []);

  const initializeYandexMap = () => {
    if (window.ymaps) {
      window.ymaps.ready(() => {
        const map = new window.ymaps.Map("yandex-map", {
          center: [mapPosition.lat, mapPosition.lng],
          zoom: 13,
          controls: ["zoomControl", "geolocationControl"],
        });

        // Add a placemark
        const placemark = new window.ymaps.Placemark(
          [mapPosition.lat, mapPosition.lng],
          {},
          {
            preset: "islands#greenDotIcon",
            draggable: true,
          }
        );

        // Update position when placemark is dragged
        placemark.events.add("dragend", function () {
          const coords = placemark.geometry.getCoordinates();
          setMapPosition({
            lat: coords[0],
            lng: coords[1],
          });
        });

        // Handle map clicks
        map.events.add("click", function (e) {
          const coords = e.get("coords");
          placemark.geometry.setCoordinates(coords);
          setMapPosition({
            lat: coords[0],
            lng: coords[1],
          });
        });

        map.geoObjects.add(placemark);
        setYandexMap(map);
        setMapLoaded(true);

        // Try to get user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const coords = [
                position.coords.latitude,
                position.coords.longitude,
              ];
              map.setCenter(coords, 15);
              placemark.geometry.setCoordinates(coords);
              setMapPosition({
                lat: coords[0],
                lng: coords[1],
              });
            },
            (error) => {
              console.log("Error getting location:", error);
            }
          );
        }
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!orderForm.address.trim()) newErrors.address = "Manzil kiritish shart";
    if (!orderForm.city.trim()) newErrors.city = "Shahar kiritish shart";
    if (!orderForm.phone.trim()) newErrors.phone = "Telefon kiritish shart";
    else if (!/^\+?[0-9]{9,13}$/.test(orderForm.phone.trim())) {
      newErrors.phone = "To'g'ri telefon raqami kiriting";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const verifyPromoCode = async () => {
    if (!orderForm.promoCode.trim()) {
      setPromoMessage({ type: "error", message: "Promo kod kiriting" });
      return;
    }

    setIsCheckingPromo(true);
    setPromoMessage({ type: "", message: "" });

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/promo/verify",
        { promoCode: orderForm.promoCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.valid) {
        setDiscount(res.data.discountPercent || 0);
        setPromoMessage({
          type: "success",
          message: `${res.data.discountPercent}% chegirma qo'llanildi!`,
        });
      } else {
        setPromoMessage({ type: "error", message: "Noto'g'ri promo kod" });
      }
    } catch (err) {
      console.error(err);
      setPromoMessage({
        type: "error",
        message:
          err.response?.data?.message || "Promo kodni tekshirishda xatolik",
      });
    } finally {
      setIsCheckingPromo(false);
    }
  };

  const calculateTotalPrice = () => {
    let basePrice = product.discountPrice || product.price;
    if (discount > 0) {
      return basePrice * (1 - discount / 100);
    }
    return basePrice;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!user || !user.id) {
      setErrors({ auth: "Buyurtma qilish uchun tizimga kiring!" });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setErrors({ auth: "Token topilmadi!" });
      return;
    }

    setIsSubmitting(true);

    try {
      const finalPrice = calculateTotalPrice();

      // Match the field names with what the backend expects
      const orderData = {
        user_id: user.id,
        address: orderForm.address,
        city: orderForm.city,
        postal_code: orderForm.postalCode, // Backend accepts both postal_code and postalCode
        phone: orderForm.phone,
        total_amount: finalPrice,
        items: [
          {
            product_id: product.id,
            quantity: 1,
            price: finalPrice,
          },
        ],
        // Include additional fields if backend needs them
        payment_method: orderForm.paymentMethod,
        notes: orderForm.notes || "",
      };

      const res = await axios.post(
        "http://localhost:5000/api/orders",
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrderId(res.data.orderId);
      setOrderComplete(true);
    } catch (err) {
      console.error(err);
      setErrors({
        submit: err.response?.data?.message || "Buyurtma yuborishda xatolik",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProductImage = () => {
    if (!product.image) return null;

    console.log(product.image);

    try {
      if (typeof product.image === "string" && product.image.startsWith("[")) {
        const imageArray = JSON.parse(product.image);
        return imageArray && imageArray.length > 0 ? imageArray[0] : null;
      } else if (Array.isArray(product.image)) {
        return product.image.length > 0 ? product.image[0] : null;
      }
      return product.image;
    } catch (e) {
      console.error("Error parsing product image:", e);
      return null;
    }
  };

  if (!product)
    return (
      <div className="p-4 text-center">
        <AlertCircle className="mx-auto text-red-500 mb-2" size={48} />
        <p className="text-lg font-medium">Mahsulot topilmadi</p>
        <p className="text-gray-500">
          Iltimos, katalogga qaytib, mahsulotni tanlang
        </p>
      </div>
    );

  if (orderComplete) {
    return (
      <div className="max-w-lg mt-[150px] mx-auto p-6 bg-white rounded-xl shadow-customm">
        <div className="text-center py-8">
          <CheckCircle className="mx-auto text-[#0fd6a0] mb-4" size={80} />
          <h2 className="text-3xl font-bold mb-4">Successfully completed!</h2>
          <p className="text-xl mb-4">Order ID: #{orderId}</p>
          <p className="text-gray-700 mb-8">
            We will contact you soon. Thank you for your purchase!
          </p>
          <button
            className="bg-[#0fd6a0] text-black px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all shadow-md"
            onClick={() => window.history.back()}
          >
            Back to main page
          </button>
        </div>
      </div>
    );
  }

  const productImage = getProductImage();
  console.log("Product image:", productImage);

  const finalPrice = calculateTotalPrice();

  return (
    <div className=" mx-auto p-4 bg-gray-50">
      <h2 className="text-3xl font-bold mb-8 text-black">Ordering</h2>

      {errors.auth && (
        <div className="bg-black bg-opacity-5 border-l-4 border-black text-black p-4 rounded mb-6">
          {errors.auth}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Product Information */}
        <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-xl font-semibold mb-4 flex items-center text-black">
            <Package className="mr-2 text-[#0fd6a0]" size={22} />
            Product informations
          </h3>

          {productImage && (
            <div className="mb-5 rounded-lg overflow-hidden shadow-sm">
              <img
                src={`http://localhost:5000/uploads/${productImage}`}
                alt={product.name}
                className="w-full h-56 object-cover"
                onError={(e) => {
                  console.log("Rasm yuklanmadi:", productImage);
                  e.target.onerror = null;
                  e.target.src = "noimage";
                }}
              />
            </div>
          )}

          <h4 className="font-bold text-xl text-black">{product.name}</h4>

          {product.description && (
            <p className="text-gray-700 mt-2 mb-5">{product.description}</p>
          )}

          <div className="border-t border-gray-100 pt-4 mt-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Price:</span>
              <span className="font-semibold">
                {product.price.toLocaleString()} $
              </span>
            </div>

            {product.discountPrice && (
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Chegirma narxi:</span>
                <span className="font-semibold text-[#0fd6a0]">
                  {product.discountPrice.toLocaleString()} $
                </span>
              </div>
            )}

            {discount > 0 && (
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Promo chegirma:</span>
                <span className="font-semibold text-[#0fd6a0]">
                  -{discount}%
                </span>
              </div>
            )}

            <div className="flex justify-between pt-3 border-t border-gray-100 mt-3">
              <span className="text-black font-medium">Total price:</span>
              <span className="font-bold text-xl text-black">
                {finalPrice.toLocaleString()} $
              </span>
            </div>
          </div>

          {/* Customer information */}
          {user && (
            <div className="mt-8 border-t border-gray-100 pt-5">
              <h3 className="text-lg font-semibold mb-3 flex items-center text-black">
                <User className="mr-2 text-[#0fd6a0]" size={20} />
                Customer informations
              </h3>
              <p className="text-gray-700">
                <strong>Username:</strong> {user.username || "Kiritilmagan"}
              </p>
              {user.email && (
                <p className="text-gray-700">
                  <strong>Email:</strong> {user.email}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Order Form */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-xl font-semibold mb-6 flex items-center text-black">
            <Home className="mr-2 text-[#0fd6a0]" size={22} />
            Delivery informations
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-black font-medium mb-2">
                Address *
              </label>
              <input
                type="text"
                name="address"
                placeholder="City, District..."
                value={orderForm.address}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0fd6a0] ${
                  errors.address ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            <div>
              <label className="block text-black font-medium mb-2">
                City *
              </label>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={orderForm.city}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0fd6a0] ${
                  errors.city ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
              )}
            </div>

            <div>
              <label className="block text-black font-medium mb-2">
                Postal code
              </label>
              <input
                type="text"
                name="postalCode"
                placeholder="Postal code"
                value={orderForm.postalCode}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0fd6a0]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-black font-medium mb-2">
                Phone number *
              </label>
              <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-[#0fd6a0]">
                <input
                  type="tel"
                  name="phone"
                  placeholder="+998 XX XXX XX XX"
                  value={orderForm.phone}
                  onChange={handleInputChange}
                  className={`w-full p-3 border-0 focus:outline-none ${
                    errors.phone ? "bg-red-50" : ""
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Promo Code Section */}
            <div className="md:col-span-2">
              <label className="text-black font-medium mb-2 flex items-center">
                <Percent className="mr-1 text-[#0fd6a0]" size={18} />
                Promo code
              </label>
              <div className="flex rounded-lg overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-[#0fd6a0]">
                <input
                  type="text"
                  name="promoCode"
                  placeholder="Enter promo code"
                  value={orderForm.promoCode}
                  onChange={handleInputChange}
                  className="w-full p-3 border-0 focus:outline-none"
                />
                <button
                  onClick={verifyPromoCode}
                  disabled={isCheckingPromo}
                  className={`px-5 py-3 font-medium ${
                    isCheckingPromo
                      ? "bg-gray-300 cursor-not-allowed text-gray-700"
                      : "bg-[#0fd6a0] hover:bg-opacity-90 text-black"
                  }`}
                >
                  {isCheckingPromo ? "Checking..." : "Check"}
                </button>
              </div>
              {promoMessage.message && (
                <p
                  className={`text-sm mt-2 ${
                    promoMessage.type === "success"
                      ? "text-[#0fd6a0]"
                      : "text-red-500"
                  }`}
                >
                  {promoMessage.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-black font-medium mb-2">
                Additional Information
              </label>
              <textarea
                name="notes"
                placeholder="Additional delivery instructions"
                value={orderForm.notes}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-[#0fd6a0]"
              />
            </div>
          </div>

          {/* Yandex Maps Integration */}
          <div className="mt-8">
            <h3 className="flex items-center text-black font-medium mb-3">
              <MapPin className="mr-2 text-[#0fd6a0]" size={20} />
              Mark the location on the map
            </h3>

            <div className="h-64 w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              <div
                id="yandex-map"
                style={{ width: "100%", height: "100%" }}
              ></div>
            </div>

            <p className="text-sm text-gray-600 mt-2">
              If you specify the exact address on the map, delivery will be
              faster
            </p>
          </div>

          {/* Payment options */}
          <div className="mt-8">
            <h3 className="flex items-center text-black font-medium mb-3">
              <CreditCard className="mr-2 text-[#0fd6a0]" size={20} />
              Payment method
            </h3>
            <div className="flex flex-col space-y-3">
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={orderForm.paymentMethod === "card"}
                  onChange={handleInputChange}
                  className="mr-3 accent-[#0fd6a0] h-5 w-5"
                />
                <span className="text-black">Credit card</span>
              </label>
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={orderForm.paymentMethod === "cash"}
                  onChange={handleInputChange}
                  className="mr-3 accent-[#0fd6a0] h-5 w-5"
                />
                <span className="text-black">Cash</span>
              </label>
            </div>
          </div>

          {/* Submit button */}
          <div className="mt-8">
            {errors.submit && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
                {errors.submit}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-4 rounded-full font-semibold text-lg shadow-md transition-all ${
                isSubmitting
                  ? "bg-gray-300 cursor-not-allowed text-gray-700"
                  : "bg-[#0fd6a0] hover:bg-opacity-90 text-black"
              }`}
            >
              {isSubmitting ? "Yuklanmoqda..." : "Order confirmation"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderPage;
