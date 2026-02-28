import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { Trash2, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const deliveryCharge = cart.length > 0 ? 15 : 0;
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const totalAmount = subtotal + deliveryCharge;

  const placeFinalOrder = async (paymentId) => {
    const formData = new FormData();
    cart.forEach((item) => {
      formData.append("files", item.file);
      formData.append("metadata", JSON.stringify({
        fileName: item.fileName,
        type: item.type,
        copies: item.copies,
        binding: item.binding,
        price: item.price
      }));
    });

    formData.append("payment_id", paymentId);
    formData.append("total_amount", totalAmount);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/orders/create-order", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        clearCart();
        alert("Order Placed Successfully! 🚀");
        navigate("/orders"); 
      } else {
        alert("Backend error! Check if /orders prefix is correct.");
      }
    } catch (err) {
      alert("Server Connection Failed!");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return alert("Cart is empty!");
    setIsProcessing(true);

    const options = {
      key: "rzp_test_SKuwVRt8zcsDpJ", 
      amount: totalAmount * 100,
      currency: "INR",
      name: "PrintEase",
      handler: (res) => placeFinalOrder(res.razorpay_payment_id),
      prefill: { email: user?.email },
      theme: { color: "#2563eb" },
      modal: { ondismiss: () => setIsProcessing(false) }
    };
    new window.Razorpay(options).open();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-8 flex items-center gap-4"><ShoppingBag size={40}/> Your Cart</h1>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-3xl flex justify-between items-center shadow-sm">
                <div>
                  <p className="font-bold">{item.fileName}</p>
                  <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest">{item.copies} Copies • {item.type}</p>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-black">₹{item.price}</span>
                  <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={20}/></button>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white h-fit shadow-2xl">
            <h3 className="text-lg font-black mb-6">Bill Details</h3>
            <div className="flex justify-between items-end pt-6 border-t border-slate-800">
                <span className="font-bold">Total Payable</span>
                <span className="text-4xl font-black text-blue-400">₹{totalAmount}</span>
            </div>
            <button onClick={handleCheckout} disabled={isProcessing} className="w-full bg-blue-600 mt-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2">
              {isProcessing ? <Loader2 className="animate-spin"/> : <>PLACE ORDER <ArrowRight/></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 