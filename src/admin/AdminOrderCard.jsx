import React from "react";
import { Clock, MapPin, User } from "lucide-react";

const OrderCard = ({
  order,
  user,
  orderItems,
  formatPrice,
  translateStatus,
  getStatusColor,
}) => {
  const accentColor = "#0fd6a0";
  const IMAGE_BASE_URL = "http://localhost:5000/uploads";
  
  return (
    <div className="bg-white font-poppins border-[#e7e2e2] rounded-xl shadow-md overflow-hidden border ">
      {/* Header - More compact */}
      <div className="border-b  border-gray-200 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-xs font-medium text-gray-500">Order #</span>
          <span className="ml-1 font-bold text-black">{order.id}</span>
        </div>
        <div
          className="px-3 py-1 rounded-full text-xs font-medium bg-codee text-white">
          {translateStatus(order.status)}
        </div>
      </div>

      <div className="p-4">
        {/* Customer info - More compact */}
        <div className="mb-3 flex justify-between items-center">
          <div className="flex items-center">
            <User size={14} className="text-gray-500 mr-1" />
            <span className="text-xs uppercase font-medium text-gray-500">
              {user?.username || "Unknown"}
            </span>
          </div>
          <div className="text-right">
            <span className="font-bold text-base" style={{ color: accentColor }}>
              {formatPrice(order.total_amount)}
            </span>
          </div>
        </div>

        {/* Order Items - More compact and price removed from name display */}
        {orderItems && orderItems.length > 0 ? (
          <div className="space-y-3 shadow-customm p-2 rounded-xl mt-2">
            {orderItems.map((item) => {
              let imageUrl = null;
              if (Array.isArray(item.product.image) && item.product.image.length > 0) {
                const fileName = item.product.image[0];
                imageUrl = `${IMAGE_BASE_URL}/${fileName}`;
              }

              return (
                <div
                  key={item.id || `${order.id}-${item.product_id}`}
                  className="flex items-center space-x-3"
                >
                  {/* Smaller image container */}
                  <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden border border-gray-200 flex items-center justify-center">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.product.name || "Product"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.style.display = "none";
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.innerHTML = `<span class='text-xs text-gray-500'>No image</span>`;
                          }
                        }}
                      />
                    ) : (
                      <span className="text-xs text-gray-500">No image</span>
                    )}
                  </div>

                  <div className="flex-1  min-w-0">
                    {/* Product name without price */}
                    <p className="font-medium text-xl text-black truncate">
                      {item.product?.name}
                    </p>
                    {/* Price displayed separately */}
                    <p className="text-xs text-gray-500">
                      Count: {item.quantity}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-gray-500">No items found</p>
        )}

        {/* Address & Date - Combined and more compact */}
        <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
          <div className="text-xs text-gray-500 flex items-start">
            <MapPin size={12} className="mr-1 flex-shrink-0 mt-0.5" />
            <span className="truncate">
              {order.address}
              {order.city ? `, ${order.city}` : ""}
            </span>
          </div>
          
          <div className="text-xs text-gray-500 flex items-center justify-end">
            <Clock size={12} className="mr-1" />
            <span>
              {new Date(order.created_at || Date.now()).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;