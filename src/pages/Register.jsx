import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL;
export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Registration Successful 🎉");
        navigate("/login"); // Direct login page par bhej dega
      } else {
        alert(data.detail || "Registration Failed");
      }
    } catch (error) {
      alert("Server is not responding!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Register</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input name="name" type="text" placeholder="Full Name" className="w-full p-3 border rounded-lg" onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" className="w-full p-3 border rounded-lg" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" className="w-full p-3 border rounded-lg" onChange={handleChange} required />
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">Register</button>
        </form>
        <p className="mt-4 text-center">Already have account? <Link to="/login" className="text-blue-600">Login</Link></p>
      </div>
    </div>
  );
}