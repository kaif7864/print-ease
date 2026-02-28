import { useEffect, useState } from "react";
import { Package, Clock, CheckCircle, FileText } from "lucide-react";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/orders/my-orders", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => { setOrders(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3"><Package className="text-blue-600"/> My Orders</h1>
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">ID: {order.payment_id}</span>
                  <p className="text-sm text-slate-400 font-bold">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="bg-orange-50 text-orange-500 px-4 py-1.5 rounded-full text-xs font-black uppercase flex items-center gap-2">
                  <Clock size={14}/> {order.order_status}
                </div>
              </div>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                    <FileText size={20} className="text-slate-400"/>
                    <div className="flex-1">
                      <p className="font-bold text-slate-700 text-sm">{item.fileName}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase">{item.copies} Copies • {item.type}</p>
                    </div>
                    <span className="font-black">₹{item.price}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t flex justify-between items-center font-black">
                <span className="text-slate-400">Total Paid</span>
                <span className="text-2xl text-blue-600">₹{order.total_price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}