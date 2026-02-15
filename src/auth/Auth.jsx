import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Chrome, Facebook, Mail, Lock, User, Phone, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';

// 1️⃣ SUPABASE CONFIGURATION
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Auth = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 2️⃣ CHECK IF USER IS ALREADY LOGGED IN
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        navigate("/dashboard");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const toggleView = () => {
    setIsSignIn(!isSignIn);
    setError("");
    setFormData({ name: "", email: "", password: "", phoneNumber: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3️⃣ SOCIAL LOGIN HANDLERS
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) throw error;
    } catch (error) {
      setError(error.message || "Google sign-in failed");
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setLoading(true);
    setError("");
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) throw error;
    } catch (error) {
      setError(error.message || "Facebook sign-in failed");
      setLoading(false);
    }
  };

  // 4️⃣ LOGIN WITH EMAIL/PASSWORD
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      // Session is automatically handled by Supabase
      // The onAuthStateChange listener will redirect to dashboard
      
    } catch (error) {
      setError(error.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 5️⃣ SIGNUP WITH EMAIL/PASSWORD
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            phone_number: formData.phoneNumber
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (authError) throw authError;

      // If user exists but unconfirmed
      if (authData?.user?.identities?.length === 0) {
        setError("An account with this email already exists.");
        return;
      }

      // Optional: Store additional user data in a custom profiles table
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            full_name: formData.name,
            email: formData.email,
            phone_number: formData.phoneNumber,
            created_at: new Date().toISOString()
          });

        if (profileError && profileError.code !== '23505') { // Ignore duplicate key errors
          console.error("Profile creation error:", profileError);
        }
      }

      // Show success message
      alert("Account created! Please check your email to verify your account.");
      toggleView();
      
    } catch (error) {
      if (error.message.includes("User already registered")) {
        setError("An account with this email already exists.");
      } else {
        setError(error.message || "Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 6️⃣ FORGOT PASSWORD HANDLER (BONUS)
  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError("Please enter your email first");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      alert("Password reset email sent! Check your inbox.");
    } catch (error) {
      setError(error.message || "Failed to send reset email");
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
            
            {/* Social Login Buttons */}
            <div className="flex gap-4 mb-6">
              <SocialButton 
                onClick={handleGoogleLogin} 
                icon={<Chrome className="w-5 h-5 text-gray-700" />} 
                disabled={loading}
              />
              <SocialButton 
                onClick={handleFacebookLogin} 
                icon={<Facebook className="w-5 h-5 text-blue-600" />} 
                disabled={loading}
              />
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
                type="button" 
                onClick={handleForgotPassword}
                className="w-full text-[#3a5ed4] text-sm underline hover:text-blue-700 transition-all"
              >
                Forgot Password?
              </button>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-[#3a5ed4] text-white py-3.5 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all cursor-pointer active:scale-95 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "SIGN IN"}
              </button>
            </form>

            <p className="mt-8 text-sm text-gray-500 md:hidden">
              Don't have an account? 
              <button onClick={toggleView} className="text-[#3a5ed4] font-bold underline ml-1">
                Sign Up
              </button>
            </p>
          </div>

          {/* --- SIGN UP FORM --- */}
          <div className={`absolute right-0 w-full md:w-1/2 h-full flex flex-col items-center justify-center p-8 transition-all duration-500 ${isSignIn ? "opacity-0 invisible pointer-events-none" : "opacity-100 visible"}`}>
            <h2 className="text-3xl font-bold text-[#3a5ed4] mb-2">Create Account</h2>
            
            {/* Social Login Buttons */}
            <div className="flex gap-4 mb-6">
              <SocialButton 
                onClick={handleGoogleLogin} 
                icon={<Chrome className="w-5 h-5 text-gray-700" />} 
                disabled={loading}
              />
              <SocialButton 
                onClick={handleFacebookLogin} 
                icon={<Facebook className="w-5 h-5 text-blue-600" />} 
                disabled={loading}
              />
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
                placeholder="Password (min 6 characters)" 
                value={formData.password} 
                onChange={handleChange} 
                minLength="6"
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
              Already have an account? 
              <button onClick={toggleView} className="text-[#3a5ed4] font-bold underline ml-1">
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

const SocialButton = ({ icon, onClick, disabled }) => (
  <button 
    type="button" 
    onClick={onClick}
    disabled={disabled}
    className="p-3 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
  >
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