import React, { useState } from "react";
import { motion } from "framer-motion";
import { Chrome, Facebook, Mail, Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const navigate = useNavigate();

  const toggleView = () => setIsSignIn(!isSignIn);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-transparent font-sans p-4 overflow-hidden">
      
      {/* Main Login Card - Adjusted height for mobile */}
      <div className="relative w-full max-w-[850px] h-[580px] md:h-[520px] bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden flex">
        
        {/* Sliding Blue Panel (Desktop Only) */}
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
            <div className="flex gap-4 mb-8">
              <SocialButton icon={<Chrome className="w-5 h-5 text-gray-700" />} />
              <SocialButton icon={<Facebook className="w-5 h-5 text-blue-600" />} />
            </div>
            <form className="w-full max-w-xs space-y-4" onSubmit={handleSubmit}>
              <InputGroup icon={<Mail className="w-4 h-4" />} type="email" placeholder="Email" required />
              <InputGroup icon={<Lock className="w-4 h-4" />} type="password" placeholder="Password" required />
              <button 
                type="submit" 
                className="w-full bg-[#3a5ed4] text-white py-3.5 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all cursor-pointer active:scale-95"
              >
                SIGN IN
              </button>
            </form>

            {/* Mobile-only toggle link */}
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
            <div className="flex gap-4 mb-8">
              <SocialButton icon={<Chrome className="w-5 h-5 text-gray-700" />} />
              <SocialButton icon={<Facebook className="w-5 h-5 text-blue-600" />} />
            </div>
            <form className="w-full max-w-xs space-y-4" onSubmit={handleSubmit}>
              <InputGroup icon={<User className="w-4 h-4" />} type="text" placeholder="Full Name" required />
              <InputGroup icon={<Mail className="w-4 h-4" />} type="email" placeholder="Email" required />
              <InputGroup icon={<Lock className="w-4 h-4" />} type="password" placeholder="Password" required />
              <button 
                type="submit" 
                className="w-full bg-[#3a5ed4] text-white py-3.5 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all cursor-pointer active:scale-95"
              >
                SIGN UP
              </button>
            </form>

            {/* Mobile-only toggle link */}
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

// --- SUB-COMPONENTS (Same as original) ---

const SocialButton = ({ icon }) => (
  <button className="p-3 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer active:scale-90">
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