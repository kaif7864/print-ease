import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const BASE_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setMessage("Reset link sent to your email! 📧");
      else setMessage("User not found!");
    } catch (err) {
      setMessage("Error connecting to server.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Reset Password</h2>
        <p className="text-slate-500 mb-6">Enter your email to get a reset link.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-slate-300" size={20} />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">
            Send Reset Link
          </button>
        </form>

        {message && <p className="mt-4 text-center text-blue-600 font-medium">{message}</p>}
        
        <Link to="/login" className="mt-6 flex items-center justify-center gap-2 text-slate-500 hover:text-blue-600">
          <ArrowLeft size={18} /> Back to Login
        </Link>
      </div>
    </div>
  );
}