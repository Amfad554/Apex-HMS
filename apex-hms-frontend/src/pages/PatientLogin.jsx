import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

export default function PatientLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await axios.post("http://localhost:5000/api/patients/login", formData);
      const data = res.data;

      localStorage.setItem("patient", JSON.stringify(data.user));
      localStorage.setItem("token", data.token || "no-token");

      navigate("/patient-dashboard");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed. Check your credentials.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full px-5 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all text-sm sm:text-base";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 flex items-center justify-center px-6 py-12 relative overflow-hidden font-sans">

      {/* Decorative blurred circles */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-2xl p-8 sm:p-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-black text-white italic tracking-tighter" style={{ fontFamily: 'serif' }}>ApexHMS</h1>
          <div className="h-1 w-12 bg-white/40 mx-auto my-3 rounded-full"></div>
          <p className="text-white/80 italic text-sm">Welcome back, sign in to continue</p>
        </div>

        {message.text && (
          <div className={`mb-4 p-3 rounded-xl text-center text-sm font-bold ${message.type === 'error' ? 'bg-red-500/20 text-red-200' : 'bg-emerald-500/20 text-emerald-100'}`}>
            {message.text}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            className={inputStyle}
            value={formData.email}
            onChange={handleChange}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              className={`${inputStyle} pr-12`}
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-white text-indigo-700 rounded-2xl font-bold text-lg hover:bg-indigo-50 hover:scale-[1.02] active:scale-95 transition-all shadow-xl mt-4"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-white/10 pt-4">
          <p className="text-sm text-white/70">
            New patient?{" "}
            <Link to="/patientregistration" className="font-bold text-white hover:underline">Register here</Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 w-full text-center text-white/60 text-xs sm:text-sm">
        Precision in Practice, Excellence in Care • AMT Hospital Systems
      </div>
    </div>
  );
}
