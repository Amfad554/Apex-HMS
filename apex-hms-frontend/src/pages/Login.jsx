import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

// Reusable Bubble Component for consistency
const FloatingBubble = ({ children, icon, color, position, delay = "0s" }) => {
  const colorClasses = {
    indigo: "bg-indigo-600 shadow-indigo-200 text-indigo-600",
    purple: "bg-purple-600 shadow-purple-200 text-purple-600",
    blue: "bg-blue-600 shadow-blue-200 text-blue-600",
  };

  return (
    <div
      className={`absolute ${position} bg-white/90 backdrop-blur-md rounded-2xl px-5 py-3 shadow-2xl flex items-center gap-3 z-30 animate-float border border-white/50`}
      style={{ animationDelay: delay }}
    >
      <div className={`${colorClasses[color].split(' ')[0]} p-2 rounded-xl text-white shadow-lg`}>
        {icon}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  // --- CORRECTED LOGIC START ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      // 1. Make the request to your backend
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });

      // 2. Destructure the response
      // Your backend returns: { id, role, hospitalName, token }
      const responseData = res.data;

      // 3. Save to localStorage
      // We save the user object and the token separately for easy access in other components
      localStorage.setItem("user", JSON.stringify({
        id: responseData.id,
        role: responseData.role,
        hospitalName: responseData.hospitalName
      }));

      localStorage.setItem("token", responseData.token || "no-token-provided");

      // 4. Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      // 5. Improved error handling for the new schema
      const errorMsg = err.response?.data?.message || "Login failed. Please check your connection.";
      setMessage({ type: "error", text: errorMsg });
    }
  };
  // --- CORRECTED LOGIC END ---

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 relative overflow-hidden font-sans">

      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative min-h-screen grid lg:grid-cols-2 gap-12 items-center px-6 lg:px-20 py-12">

        {/* LEFT SIDE - Doctor Image & Feature Bubbles */}
        <div className="relative hidden lg:block h-full self-center">

          <FloatingBubble
            color="indigo"
            position="top-[40%] -left-4"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Secure</p>
            <p className="text-sm font-bold text-gray-800 leading-tight">Patient Records</p>
          </FloatingBubble>

          <FloatingBubble
            color="blue"
            position="top-[65%] -left-10"
            delay="0.5s"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Real-time</p>
            <p className="text-sm font-bold text-gray-800 leading-tight">Schedules</p>
          </FloatingBubble>

          <FloatingBubble
            color="purple"
            position="top-[45%] right-4"
            delay="1.2s"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Instant</p>
            <p className="text-sm font-bold text-gray-800 leading-tight">Appointments</p>
          </FloatingBubble>

          <div className="relative z-20 mt-10">
            <img
              src="/Image/doctor2.png"
              alt="Doctor"
              className="w-full max-w-md h-auto block mx-auto"
              style={{ filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.5))' }}
              onError={(e) => { e.target.src = "https://via.placeholder.com/400x600?text=Doctor+Image"; }}
            />
          </div>
        </div>

        {/* RIGHT SIDE - Hospital Login Form */}
        <div className="relative z-20 flex flex-col items-center lg:items-end justify-center w-full">

          <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl sm:text-5xl font-black text-white italic tracking-tighter" style={{ fontFamily: 'serif' }}>
                ApexHMS
              </h1>
              <div className="h-1 w-12 bg-white/40 mx-auto my-3 rounded-full"></div>
              <p className="text-white/80 italic text-sm">Welcome back, Sign in to continue</p>
            </div>

            {/* Error/Verification Message Display */}
            {message.text && (
              <div className={`mb-4 p-4 rounded-2xl text-xs font-bold text-center ${message.type === 'error' ? 'bg-red-500/20 text-red-200' : 'bg-amber-500/20 text-amber-200'}`}>
                {message.text}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleLogin}>
              <div className="space-y-4">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Hospital Email Address"
                  className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all text-sm sm:text-base"
                />

                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all text-sm sm:text-base pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between px-1 text-white text-xs sm:text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-white/30 bg-white/10 text-indigo-500 focus:ring-white/40 cursor-pointer transition-colors"
                  />
                  <span className="group-hover:text-white transition-colors">Remember me</span>
                </label>
                <a href="#" className="hover:text-white/70 transition-colors font-medium">Forgot password?</a>
              </div>

              <button type="submit" className="w-full py-4 bg-white text-indigo-700 rounded-2xl font-bold text-lg hover:bg-indigo-50 hover:scale-[1.02] active:scale-95 transition-all shadow-xl mt-4">
                Login to Dashboard
              </button>
            </form>

            <div className="mt-8 text-center border-t border-white/10 pt-6">
              <p className="text-sm text-white/70">
                New facility?{" "}
                <Link to="/" className="font-bold text-white hover:underline transition-all underline-offset-4">
                  Register here
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-10 text-center lg:text-right px-4">
            <p className="text-white/90 font-medium italic text-lg tracking-tight">Precision in Practice, Excellence in Care</p>
            <p className="text-white/50 text-xs mt-1 uppercase tracking-widest font-bold">AMT Hospital Systems</p>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
          }
          .animate-float { animation: float 5s ease-in-out infinite; }
        `}
      </style>
    </div>
  );
}