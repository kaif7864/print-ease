import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { LogIn, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react"; // 🔥 Added Eye icons

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false); // 🔥 Password visibility state

  const BASE_URL = import.meta.env.VITE_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        const userData = data.user_data || { email };
        login(userData, data.access_token);
        if (userData?.role === "admin") {
          navigate("/admin-orders");
        } else {
          navigate("/dashboard");
        }
      } else {
        alert(data.detail || "Invalid Credentials");
      }
    } catch (error) {
      alert("Backend error! Make sure server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200 w-full max-w-md border border-slate-100">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <LogIn className="text-white" size={28} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-slate-400 text-sm font-medium mt-2">
            Log in to manage your print stack
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-slate-300" size={20} />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password with Eye Toggle */}
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-slate-300" size={20} />
            <input
              type={showPass ? "text" : "password"} // 🔥 Toggle type
              placeholder="Password"
              className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-4 text-slate-300 hover:text-slate-500 transition-colors"
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>


          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-black text-white text-lg transition-all flex items-center justify-center gap-2 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-xl shadow-blue-500/20"
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                AUTHENTICATING...
              </div>
            ) : (
              <>
                SIGN IN <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
          {/* Forgot Password Link */}
          <div className="flex justify-end px-2 mt-2 text-sm pt-4">
            <Link 
              to="/forgotpassword" 
              className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

        {/* Footer */}
        <div className=" pt-6 border-t border-slate-50 text-center">
          <p className="text-slate-500 font-medium">
            New to PrintEase?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-bold hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}