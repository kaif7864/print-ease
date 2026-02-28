import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  // Jab tak loading true hai, tab tak login par redirect mat karo
  if (loading) {
  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div>
    </div>
  );
}
  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}