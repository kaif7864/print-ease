import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AdminOrders() {
  const { token, loading: authLoading } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (authLoading) return;
      if (!token) {
        setError("Admin access required. Please login.");
        setOrdersLoading(false);
        return;
      }

      try {
        setOrdersLoading(true);
        const res = await fetch(`${BASE_URL}/admin/orders`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (res.status === 401) throw new Error("Session expired or Unauthorized.");
        if (!res.ok) throw new Error(`Error ${res.status}: Failed to fetch orders`);

        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [token, authLoading]);

  const markCompleted = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/admin/orders/${id}/complete`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            (order._id === id || order.id === id) ? { ...order, status: "completed" } : order
          )
        );
      } else {
        alert("Action failed. Check admin permissions.");
      }
    } catch (err) {
      console.error("Error updating order", err);
    }
  };

  if (authLoading || ordersLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading admin data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Panel: All Orders</h1>

      {orders.length === 0 ? (
        <div className="text-gray-500 text-center border-2 border-dashed p-10">No orders found.</div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="p-5 border border-gray-200 rounded-2xl shadow-sm bg-white">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 font-mono">ID: {order._id}</p>
                  <p className="font-semibold text-lg">User: {order.user_email || order.email}</p>
                  <p className="text-sm">Total: <span className="font-bold">₹{order.total_price || order.amount}</span></p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  order.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                }`}>
                  {order.status || "Paid"}
                </span>
              </div>

              {/* --- FILES SECTION (CLOUD RETRIEVAL) --- */}
              <div className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100">
                <h3 className="text-sm font-bold text-gray-700 mb-3">Order Files:</h3>
                <div className="grid grid-cols-1 gap-3">
                  {order.items && order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-blue-600 truncate max-w-[200px]">{item.fileName}</span>
                        <span className="text-xs text-gray-500">{item.type} | {item.copies} Copies {item.binding ? "+ Binding" : ""}</span>
                      </div>
                      
                      {/* View/Print Button */}
                      <a 
                        href={item.file_path} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-4 py-2 rounded-md transition-all flex items-center gap-1"
                      >
                        📄 Open & Print
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {order.status !== "completed" && (
                <button
                  onClick={() => markCompleted(order._id)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-xl transition-colors"
                >
                  Mark as Order Delivered/Completed
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}