import React, { useState } from "react";
import { motion } from "framer-motion";
import { Chrome, Facebook, Mail, Lock, User, Phone, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const navigate = useNavigate();

  // State for form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleView = () => {
    setIsSignIn(!isSignIn);
    setError(""); // Clear errors when switching
    setFormData({ name: "", email: "", password: "", phoneNumber: "" }); // Clear form
  };

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- LOGIN LOGIC ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save Token
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("userId", data.user_id);
        navigate("/dashboard");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Server error. Is the backend running?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- SIGNUP LOGIC ---
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/signup/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber
        }),
      });

      if (response.status === 201) {
        alert("Account created! Please sign in.");
        toggleView(); // Switch to login view
      } else {
        const data = await response.json();
        setError(data.message || "Signup failed. Email might exist.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-100 font-sans p-4 overflow-hidden">
      
      <div className="relative w-full max-w-[850px] h-[600px] md:h-[550px] bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden flex">
        
        {/* Sliding Blue Panel */}
        <motion.div
          animate={{ x: isSignIn ? "100%" : "0%" }}
          transition={{ type: "spring", stiffness: 70, damping: 18 }}
          className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-[#3a5ed4] to-[#2e4eb8] z-30 hidden md:flex flex-col items-center justify-center text-white p-12 text-center"
        >
          <div className="w-12 h-12 bg-white rounded-full mb-6 flex items-center justify-center shadow-lg">
            <span className="text-[#3a5ed4] font-bold text-2xl">O</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">
            {isSignIn ? "Hello, Friend!" : "Welcome Back!"}
          </h2>
          <p className="text-sm mb-10 opacity-90 leading-relaxed px-4">
            {isSignIn 
              ? "Begin your journey with O Dental Clinic for a brighter smile." 
              : "Please login with your personal info to stay connected."}
          </p>
          <button 
            onClick={toggleView} 
            className="px-12 py-3 border-2 border-white rounded-full font-bold hover:bg-white hover:text-[#3a5ed4] transition-all cursor-pointer active:scale-95"
          >
            {isSignIn ? "SIGN UP" : "SIGN IN"}
          </button>
        </motion.div>

        {/* Forms Container */}
        <div className="relative w-full flex h-full">
          
          {/* --- SIGN IN FORM --- */}
          <div className={`absolute left-0 w-full md:w-1/2 h-full flex flex-col items-center justify-center p-8 transition-all duration-500 ${!isSignIn ? "opacity-0 invisible pointer-events-none" : "opacity-100 visible"}`}>
            <h2 className="text-3xl font-bold text-[#3a5ed4] mb-2">Sign In</h2>
            <div className="flex gap-4 mb-6">
              <SocialButton icon={<Chrome className="w-5 h-5 text-gray-700" />} />
              <SocialButton icon={<Facebook className="w-5 h-5 text-blue-600" />} />
            </div>
            
            <form className="w-full max-w-xs space-y-4" onSubmit={handleLogin}>
              <InputGroup 
                icon={<Mail className="w-4 h-4" />} 
                name="email"
                type="email" 
                placeholder="Email" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
              <InputGroup 
                icon={<Lock className="w-4 h-4" />} 
                name="password"
                type="password" 
                placeholder="Password" 
                value={formData.password}
                onChange={handleChange}
                required 
              />
              
              {error && <p className="text-red-500 text-xs text-center">{error}</p>}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#3a5ed4] text-white py-3.5 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all cursor-pointer active:scale-95 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "SIGN IN"}
              </button>
            </form>

            <p className="mt-8 text-sm text-gray-500 md:hidden">
              Don't have an account?{" "}
              <button onClick={toggleView} className="text-[#3a5ed4] font-bold underline">
                Sign Up
              </button>
            </p>
          </div>

          {/* --- SIGN UP FORM --- */}
          <div className={`absolute right-0 w-full md:w-1/2 h-full flex flex-col items-center justify-center p-8 transition-all duration-500 ${isSignIn ? "opacity-0 invisible pointer-events-none" : "opacity-100 visible"}`}>
            <h2 className="text-3xl font-bold text-[#3a5ed4] mb-2">Create Account</h2>
            <div className="flex gap-4 mb-6">
              <SocialButton icon={<Chrome className="w-5 h-5 text-gray-700" />} />
              <SocialButton icon={<Facebook className="w-5 h-5 text-blue-600" />} />
            </div>
            
            <form className="w-full max-w-xs space-y-3" onSubmit={handleSignup}>
              <InputGroup 
                icon={<User className="w-4 h-4" />} 
                name="name"
                type="text" 
                placeholder="Full Name" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
              <InputGroup 
                icon={<Mail className="w-4 h-4" />} 
                name="email"
                type="email" 
                placeholder="Email" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
              <InputGroup 
                icon={<Phone className="w-4 h-4" />} 
                name="phoneNumber"
                type="tel" 
                placeholder="Phone Number" 
                value={formData.phoneNumber}
                onChange={handleChange}
              />
              <InputGroup 
                icon={<Lock className="w-4 h-4" />} 
                name="password"
                type="password" 
                placeholder="Password" 
                value={formData.password}
                onChange={handleChange}
                required 
              />

              {error && <p className="text-red-500 text-xs text-center">{error}</p>}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#3a5ed4] text-white py-3.5 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all cursor-pointer active:scale-95 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "SIGN UP"}
              </button>
            </form>

            <p className="mt-8 text-sm text-gray-500 md:hidden">
              Already have an account?{" "}
              <button onClick={toggleView} className="text-[#3a5ed4] font-bold underline">
                Sign In
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const SocialButton = ({ icon }) => (
  <button type="button" className="p-3 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer active:scale-90">
    {icon}
  </button>
);

const InputGroup = ({ icon, ...props }) => (
  <div className="relative">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
      {icon}
    </div>
    <input 
      {...props} 
      className="w-full pl-12 pr-4 py-3.5 bg-[#eef0f7] border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#3a5ed4] transition-all" 
    />
  </div>
);

export default Auth;