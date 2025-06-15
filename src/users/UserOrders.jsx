import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Search, Package, Clock, ShoppingBag, MapPin, Phone, Calendar, CreditCard, X } from "lucide-react";
import UserNavbar from "./UsersNavbar";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Brand color
  const primaryColor = "#0fd6a0";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
      } catch (e) {
        setError("Tokenni o'qishda xatolik");
        setLoading(false);
      }
    } else {
      setError("Token topilmadi");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const userId = user.userId || user.id || user.user_id;
    if (!userId) {
      setError("User ID token ichida topilmadi");
      setLoading(false);
      return;
    }

    const apiUrl = `/api/userorders/orders?user_id=${userId}`;

    axios.get(apiUrl)
      .then(res => {
        const data = res.data;
        setOrders(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error("Buyurtmalarni olishda xatolik:", err);
        setError(`Buyurtmalarni olishda xatolik: ${err.message}`);
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, [user]);

  // Get order status badge color based on status
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case "delivered":
      case "yetkazildi":
        return "bg-green-100 text-green-800";
      case "processing":
      case "jarayonda":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
      case "bekor qilindi":
        return "bg-red-100 text-red-800";
      case "shipped":
      case "jo'natildi":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date to more readable format
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("uz-UZ", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (e) {
      return dateString;
    }
  };

  // Filter orders based on search term
  const filteredOrders = orders.filter(order =>
    order.order_id?.toString().includes(searchTerm) ||
    order.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items?.some(item => 
      item.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-4 border-t-green-500 border-gray-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
            <X className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="mb-4 text-xl font-bold text-center text-gray-800">Xatolik</h2>
          <p className="text-center text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-yellow-100 rounded-full">
            <X className="w-6 h-6 text-yellow-600" />
          </div>
          <h2 className="mb-4 text-xl font-bold text-center text-gray-800">Foydalanuvchi aniqlanmadi</h2>
          <p className="text-center text-gray-600">Iltimos, qayta login qiling.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-5 ">
      <UserNavbar />
      <div className=" ml-[300px] shadow-customm rounded-xl p-4 pl-6 pt-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My orders</h1>
          <p className="mt-1 text-gray-600">Your all orders is here</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-3 pl-10 pr-4 text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Search by order number, status yoki product name ..."
          />
        </div>

        {filteredOrders.length === 0 ? (
          <div className="p-8 mt-4 text-center bg-white rounded-lg shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
              <ShoppingBag className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="mb-2 text-xl font-medium text-gray-800">Orders not found</h3>
            <p className="text-gray-600">
              {searchTerm ? "No results found for your search. Search with another word." : "You have no orders yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredOrders.map(order => (
              <div 
                key={order.order_id}
                className="overflow-hidden bg-white border border-gray-100 rounded-lg shadow-sm transition-all hover:shadow-md"
              >
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border-b border-gray-100 gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ backgroundColor: `${primaryColor}20` }}>
                      <Package className="w-5 h-5" style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Order #{order.order_id}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:space-x-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(order.created_at)}
                    </div>
                    <div className="flex items-center text-sm font-medium" style={{ color: primaryColor }}>
                      <CreditCard className="w-4 h-4 mr-1" />
                      ${order.total_amount}
                    </div>
                    <button
                      onClick={() => setExpandedOrder(expandedOrder === order.order_id ? null : order.order_id)}
                      className="px-3 py-1 text-sm font-medium rounded-md transition-colors"
                      style={{ 
                        backgroundColor: expandedOrder === order.order_id ? primaryColor : `${primaryColor}15`,
                        color: expandedOrder === order.order_id ? 'white' : primaryColor
                      }}
                    >
                      {expandedOrder === order.order_id ? "Close" : "Details"}
                    </button>
                  </div>
                </div>

                {/* Order Details (expandable) */}
                {expandedOrder === order.order_id && (
                  <div className="p-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center mb-2">
                          <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">Delivery address</span>
                        </div>
                        <p className="text-sm text-gray-600">{order.address}, {order.city}, {order.postal_code}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Phone className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">Connecting info</span>
                        </div>
                        <p className="text-sm text-gray-600">{order.phone}</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <h4 className="mb-3 text-sm font-medium text-gray-700">Products:</h4>
                    <div className="space-y-3">
                      {order.items && order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0 w-16 h-16 mr-4 overflow-hidden bg-gray-100 rounded-md">
                            {item.product_image ? (
                              <img
                                src={item.product_image.includes('http')
                                  ? item.product_image
                                  : `http://localhost:5000/uploads/${Array.isArray(item.product_image)
                                    ? item.product_image[0]
                                    : item.product_image}`}
                                alt={item.product_name}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full bg-gray-200">
                                <Package className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{item.product_name}</h5>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-sm text-gray-600">Count: {item.quantity}</span>
                              <span className="font-medium" style={{ color: primaryColor }}>${item.item_price}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;