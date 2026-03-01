import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Correction: Token ko state mein rakhein taaki context ise distribute kar sake
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      const savedToken = localStorage.getItem("token");
      const BASE_URL = import.meta.env.VITE_API_URL;
      
      if (savedToken) {
        try {
          const res = await fetch(`${BASE_URL}/profile`, {
            headers: { Authorization: `Bearer ${savedToken}` },
          });

          if (res.ok) {
            const data = await res.json();
            setUser(data);
            setToken(savedToken); // State update karein
          } else {
            // Token expire ho gaya
            logout();
          }
        } catch (err) {
          console.error("Session verification failed:", err);
          const savedUser = localStorage.getItem("user");
          if (savedUser) setUser(JSON.parse(savedUser));
        }
      }
      setLoading(false);
    };

    verifySession();
  }, []);

  const login = (userData, userToken) => {
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(userToken); // State update
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null); // State clear
    setUser(null);
  };

  return (
    // Correction: Token ko value mein pass karna zaroori hai
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};