import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on start
  useEffect(() => {
    const savedCart = localStorage.getItem("print_cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("print_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => setCart([...cart, item]);
  const removeFromCart = (id) => setCart(cart.filter(i => i.id !== id));
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}; 