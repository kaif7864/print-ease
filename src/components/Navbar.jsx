import { Link, useNavigate, useLocation } from "react-router-dom";
import { Printer, User, LogOut } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Path check kar lena

export default function Navbar() {
  const { user, logout } = useContext(AuthContext); // Context se user data lo
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Context wala logout function
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
            <Printer size={20} className="text-white" />
          </div>
          <span className="text-xl font-black text-slate-800 tracking-tighter">PrintEase</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition">
                Dashboard
              </Link>
              {/* // Navbar.jsx */}
<Link to="/orders" className="font-bold text-slate-600 hover:text-blue-600">
  My Orders
</Link>
              <div className="flex items-center gap-3 bg-slate-50 p-1 pr-3 rounded-full border">
                <Link to="/profile" className="p-1.5 bg-white shadow-sm rounded-full text-blue-600">
                  <User size={18} />
                </Link>
                <span className="text-xs font-bold text-slate-700">{user.name}</span>
              </div>
              <button 
                onClick={handleLogout} 
                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-blue-600">
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200"
              >
                Join Now
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}