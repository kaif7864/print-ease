import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Default true rakhein

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem("token");
      
      if (token) {
        try {
          // Backend se fresh data mangwayein
          const res = await fetch("http://127.0.0.1:8000/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.ok) {
            const data = await res.json();
            setUser(data); // User state fill ho gayi
          } else {
            // Agar token expire ho gaya toh clear karein
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
          }
        } catch (err) {
          console.error("Session verification failed:", err);
          // Network error par purana data fallback le sakte hain
          const savedUser = localStorage.getItem("user");
          if (savedUser) setUser(JSON.parse(savedUser));
        }
      }
      
      // Sab kuch check hone ke baad loading false karein
      setLoading(false); 
    };

    verifySession();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};