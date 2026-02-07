import { Link, NavLink, useNavigate } from "react-router-dom";
import { Activity, Menu, X, Building2, LayoutDashboard, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  
  // Timeout settings (e.g., 30 minutes)
  const AUTO_LOGOUT_TIME = 30 * 60 * 1000; 
  const timeoutRef = useRef(null);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event('authChange'));
    setIsLoggedIn(false);
    setOpen(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    navigate("/");
  };

  // --- Auto Logout Logic ---
  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (isLoggedIn) {
      timeoutRef.current = setTimeout(() => {
        console.log("Session expired due to inactivity.");
        handleLogout();
      }, AUTO_LOGOUT_TIME);
    }
  };

  useEffect(() => {
    checkAuth();

    // Events to watch for activity
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    if (isLoggedIn) {
      resetTimer();
      activityEvents.forEach(event => 
        window.addEventListener(event, resetTimer)
      );
    }

    window.addEventListener('authChange', checkAuth);
    window.addEventListener('storage', checkAuth);

    return () => {
      activityEvents.forEach(event => 
        window.removeEventListener(event, resetTimer)
      );
      window.removeEventListener('authChange', checkAuth);
      window.removeEventListener('storage', checkAuth);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isLoggedIn]); // Re-run when login status changes

  const navLinkStyle = ({ isActive }) =>
    `relative py-2 transition-all duration-300 font-medium ${
      isActive 
        ? "text-indigo-600 font-bold after:w-full" 
        : "text-slate-600 hover:text-indigo-600 after:w-0"
    } after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-indigo-600 after:transition-all after:duration-300`;

  return (
    <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-105 transition">
            <Activity size={22} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">
            HMS<span className="text-indigo-600">Care</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <NavLink to="/" className={navLinkStyle}>Home</NavLink>
          <NavLink to="/features" className={navLinkStyle}>Features</NavLink>
          <NavLink to="/pricing" className={navLinkStyle}>Pricing</NavLink>
          <NavLink to="/security" className={navLinkStyle}>Security</NavLink>
          <NavLink to="/contact" className={navLinkStyle}>Contact</NavLink>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Link
                to="/hospitaldashboard"
                className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-100"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-lg border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 transition"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              to="/hospital/auth"
              className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex items-center gap-2"
            >
              <Building2 size={18} />
              Hospital Portal
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-slate-700">
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t bg-white px-6 py-8 space-y-6 shadow-2xl">
          <div className="flex flex-col gap-4">
            {["/", "/features", "/pricing", "/security", "/contact"].map((path) => (
              <NavLink 
                key={path}
                to={path} 
                onClick={() => setOpen(false)}
                className={({ isActive }) => 
                  `text-lg font-semibold transition ${isActive ? 'text-indigo-600 border-l-4 border-indigo-600 pl-3' : 'text-slate-700 pl-3'}`
                }
              >
                {path === "/" ? "Home" : path.substring(1).charAt(0).toUpperCase() + path.substring(2)}
              </NavLink>
            ))}
          </div>
          
          <div className="pt-6 border-t space-y-3">
            {isLoggedIn ? (
              <>
                <Link
                  to="/hospitaldashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-blue-600 text-white font-bold w-full"
                >
                  <LayoutDashboard size={20} />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-red-50 text-red-600 font-bold w-full border border-red-100"
                >
                  <LogOut size={20} />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/hospital/auth"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-indigo-600 text-white font-bold w-full"
              >
                <Building2 size={20} />
                Hospital Portal
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}