import { useState } from "react";
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom"; 
import wavy from "../assets/wavy.png";

function Auth() {
  const navigate = useNavigate(); 
  const [isSignIn, setIsSignIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!isSignIn && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!isSignIn && !formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!isSignIn && formData.phone.trim() && !/^[+]?[\d\s()-]+$/.test(formData.phone)) {
      newErrors.phone = "Phone number is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock authentication
      const userData = {
        email: formData.email,
        name: formData.name || formData.email.split('@')[0],
        role: "patient",
        token: `demo-token-${Date.now()}`,
      };

      // Store user data
      localStorage.setItem("userToken", userData.token);
      localStorage.setItem("userData", JSON.stringify(userData));

      console.log(isSignIn ? "Sign In successful:" : "Sign Up successful:", userData);

      // Redirect to dashboard
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Authentication error:", error);
      setErrors({ submit: "Authentication failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsSignIn(!isSignIn);
    setErrors({});
    setFormData({ email: "", password: "", name: "", phone: "" });
  };

  const handleSocialLogin = (provider) => {
    console.log(`${provider} login clicked`);
    // Implement social login logic here
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          {/* Left Side - Form Section */}
          <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
            {/* Logo/Brand */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl sm:text-2xl">O</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                    O Dental Clinic
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500">Your Smile, Our Care</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">
                {isSignIn
                  ? "Welcome back! Please enter your details."
                  : "Create an account to get started."}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 sm:mb-8 bg-gray-100 p-1.5 rounded-xl">
              <button
                onClick={switchMode}
                type="button"
                disabled={isLoading}
                className={`flex-1 py-2.5 sm:py-3 px-4 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 ${
                  isSignIn
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                } ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
              >
                Sign In
              </button>
              <button
                onClick={switchMode}
                type="button"
                disabled={isLoading}
                className={`flex-1 py-2.5 sm:py-3 px-4 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 ${
                  !isSignIn
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                } ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
              >
                Sign Up
              </button>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Sign Up Only - Name */}
              {!isSignIn && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isLoading}
                      placeholder="John Doe"
                      className={`w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${
                        errors.name ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                      } ${isLoading ? "bg-gray-50 cursor-not-allowed" : ""}`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs sm:text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    placeholder="you@example.com"
                    className={`w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${
                      errors.email ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                    } ${isLoading ? "bg-gray-50 cursor-not-allowed" : ""}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs sm:text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Sign Up Only - Phone */}
              {!isSignIn && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isLoading}
                      placeholder="+1 (234) 567-8900"
                      className={`w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${
                        errors.phone ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                      } ${isLoading ? "bg-gray-50 cursor-not-allowed" : ""}`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs sm:text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
              )}

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    placeholder="••••••••"
                    className={`w-full pl-10 sm:pl-11 pr-12 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${
                      errors.password ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                    } ${isLoading ? "bg-gray-50 cursor-not-allowed" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs sm:text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Sign In Only - Remember & Forgot */}
              {isSignIn && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      disabled={isLoading}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
                    />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
              )}

              {/* Sign Up Only - Terms */}
              {!isSignIn && (
                <div className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    disabled={isLoading}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 mt-0.5 disabled:cursor-not-allowed"
                    required={!isSignIn}
                  />
                  <span className="text-gray-600">
                    I agree to the{" "}
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                      Privacy Policy
                    </a>
                  </span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 font-semibold text-sm sm:text-base shadow-lg shadow-blue-500/30 hover:shadow-blue-600/40 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>{isSignIn ? "Sign In" : "Create Account"}</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6 sm:my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={() => handleSocialLogin('Google')}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium text-gray-700 text-sm sm:text-base disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="hidden sm:inline">Google</span>
              </button>
              <button 
                type="button"
                onClick={() => handleSocialLogin('Facebook')}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium text-gray-700 text-sm sm:text-base disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="hidden sm:inline">Facebook</span>
              </button>
            </div>

            {/* Alternative Action */}
            <p className="text-center text-sm text-gray-600 mt-6">
              {isSignIn ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={switchMode}
                disabled={isLoading}
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSignIn ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>

          {/* Right Side - Image & Info */}
          <div className="hidden lg:flex relative bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 overflow-hidden">
            {/* Background Image */}
            <img
              src={wavy}
              alt="Dental Clinic Background"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />

            {/* Content Overlay */}
            <div className="relative z-10 flex flex-col justify-center p-12 text-white">
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl xl:text-4xl font-bold mb-4 leading-tight">
                    Welcome to<br />O Dental Clinic
                  </h2>
                  <p className="text-lg text-blue-100 leading-relaxed">
                    Your smile is our priority. Join thousands of satisfied patients
                    who trust us with their dental care.
                  </p>
                </div>

                <div className="space-y-4 pt-4">
                  {[
                    "Expert Dental Care",
                    "Modern Equipment",
                    "24/7 Support",
                    "Affordable Pricing"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-4 group">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-lg font-medium text-blue-50">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 pt-8 mt-8 border-t border-white/20">
                  <div>
                    <div className="text-3xl font-bold">10K+</div>
                    <div className="text-sm text-blue-100">Happy Patients</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">50+</div>
                    <div className="text-sm text-blue-100">Expert Doctors</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">15+</div>
                    <div className="text-sm text-blue-100">Years Experience</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;