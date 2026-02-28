import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, MapPin, LogOut, ShieldCheck } from "lucide-react";

export default function Profile() {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Agar context mein user nahi hai toh login bhej do
  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100">
          
          {/* Header/Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-end justify-center">
            <div className="w-24 h-24 bg-white rounded-3xl shadow-lg translate-y-12 flex items-center justify-center border-4 border-white">
              <User size={48} className="text-blue-600" />
            </div>
          </div>

          {/* Content */}
          <div className="pt-16 pb-10 px-10 text-center">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">{user.name}</h2>
            <div className="flex items-center justify-center gap-1 mt-1 text-blue-500 font-bold text-xs uppercase tracking-widest">
              <ShieldCheck size={14} /> Verified Student
            </div>

            <div className="mt-10 grid gap-4 text-left">
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="bg-white p-2 rounded-xl shadow-sm text-slate-400"><Mail size={20} /></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Email Address</p>
                  <p className="text-slate-700 font-semibold">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="bg-white p-2 rounded-xl shadow-sm text-slate-400"><Phone size={20} /></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</p>
                  <p className="text-slate-700 font-semibold">{user.phone || "Not Provided"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="bg-white p-2 rounded-xl shadow-sm text-slate-400"><MapPin size={20} /></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Delivery Address</p>
                  <p className="text-slate-700 font-semibold truncate w-64">{user.address || "No address saved"}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="mt-10 w-full flex items-center justify-center gap-2 py-4 bg-red-50 text-red-500 font-bold rounded-2xl hover:bg-red-100 transition-colors group"
            >
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
              Logout from Account
            </button>
          </div>
        </div>

        <p className="text-center mt-8 text-slate-400 text-sm">
          Want to change your details? <span className="text-blue-600 font-bold cursor-pointer">Contact Support</span>
        </p>
      </div>
    </div>
  );
}