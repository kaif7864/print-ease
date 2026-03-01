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
  const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;
  const BASE_URL = import.meta.env.VITE_API_URL;
  console.log("api_url:", BASE_URL);

  const deliveryCharge = cart.length > 0 ? 1 : 0;
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const totalAmount = subtotal + deliveryCharge;

  // ==========================
  // FINAL ORDER CREATE
  // ==========================
  const placeFinalOrder = async (paymentId) => {
    const formData = new FormData();

    cart.forEach((item) => {
      formData.append("files", item.file);
      formData.append(
        "metadata",
        JSON.stringify({
          fileName: item.fileName,
          type: item.type,
          copies: item.copies,
          binding: item.binding,
          price: item.price,
        })
      );
    });

    formData.append("payment_id", paymentId);
    formData.append("total_amount", totalAmount);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/orders/create-order`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        clearCart();
        alert("Order Placed Successfully! 🚀");
        navigate("/orders");
      } else {
        alert("Order creation failed!");
      }
    } catch (err) {
      alert("Server connection failed!");
    } finally {
      setIsProcessing(false);
    }
  };

  // ==========================
  // HANDLE CHECKOUT
  // ==========================
  const handleCheckout = async () => {
  if (cart.length === 0) return alert("Cart is empty!");

  setIsProcessing(true);

  try {
    // 1️⃣ Create Razorpay order from backend
    const orderRes = await fetch(`${BASE_URL}/orders/create-razorpay-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: totalAmount }),
    });

    const orderData = await orderRes.json();

    // 2️⃣ Open Razorpay checkout
    const options = {
      key: RAZORPAY_KEY,
      amount: orderData.amount,
      currency: "INR",
      name: "PrintEase",
      description: "Print Service Payment",
      order_id: orderData.id, // ✅ VERY IMPORTANT

      handler: async function (response) {
        try {
          // 3️⃣ Verify payment
          const verifyRes = await fetch(
            `${BASE_URL}/orders/verify-payment`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            }
          );

          const verifyData = await verifyRes.json();

          if (verifyData.status === "verified") {
            await placeFinalOrder(response.razorpay_payment_id);
          } else {
            alert("Payment verification failed!");
            setIsProcessing(false);
          }
        } catch (error) {
          alert("Payment verification error!");
          setIsProcessing(false);
        }
      },

      prefill: {
        email: user?.email,
      },

      theme: {
        color: "#2563eb",
      },

      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        },
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  } catch (err) {
    alert("Checkout failed!");
    setIsProcessing(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-8 flex items-center gap-4">
          <ShoppingBag size={40} /> Your Cart
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* CART ITEMS */}
          <div className="md:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-3xl flex justify-between items-center shadow-sm"
              >
                <div>
                  <p className="font-bold">{item.fileName}</p>
                  <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest">
                    {item.copies} Copies • {item.type}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <span className="font-black">₹{item.price}</span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-300 hover:text-red-500"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* BILL SECTION */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white h-fit shadow-2xl">
            <h3 className="text-lg font-black mb-6">Bill Details</h3>

            <div className="flex justify-between items-end pt-6 border-t border-slate-800">
              <span className="font-bold">Total Payable</span>
              <span className="text-4xl font-black text-blue-400">
                ₹{totalAmount}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-blue-600 mt-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  PLACE ORDER <ArrowRight />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}