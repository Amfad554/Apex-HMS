import { Link } from "react-router-dom";

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

export default function Signup() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 relative overflow-hidden font-sans">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative min-h-screen grid lg:grid-cols-2 gap-12 items-center px-6 lg:px-20 py-12">
        
        {/* LEFT SIDE - Doctor & Floating Elements */}
        <div className="relative hidden lg:block h-full self-center">
          
          {/* Bubble 1: Now at shoulder height left */}
          <FloatingBubble 
            color="indigo" 
            position="top-[40%] -left-4" 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Reliable</p>
            <p className="text-sm font-bold text-gray-800 leading-tight">Billing & Claims</p>
          </FloatingBubble>

          {/* Bubble 2: Now at waist height left */}
          <FloatingBubble 
            color="purple" 
            position="top-[65%] -left-10" 
            delay="0.5s"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Inventory</p>
            <p className="text-sm font-bold text-gray-800 leading-tight">Pharmacy Mgmt</p>
          </FloatingBubble>

          {/* Bubble 3: Now at shoulder height right */}
          <FloatingBubble 
            color="blue" 
            position="top-[45%] right-4" 
            delay="1.2s"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Smarter</p>
            <p className="text-sm font-bold text-gray-800 leading-tight">Appointments</p>
          </FloatingBubble>

          {/* Doctor Image - Reduced top margin to fit bubbles better */}
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

        {/* RIGHT SIDE - Form */}
        <div className="relative z-20 flex flex-col items-center lg:items-end justify-center w-full">
          <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl sm:text-5xl font-black text-white italic tracking-tighter" style={{ fontFamily: 'serif' }}>ApexHMS</h1>
              <div className="h-1 w-12 bg-white/40 mx-auto my-3 rounded-full"></div>
              <p className="text-white/80 italic text-sm">Register your facility to begin</p>
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="Hospital Name" className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all text-sm" />
              <div className="grid grid-cols-2 gap-4">
                <input type="email" placeholder="Official Email" className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all text-sm" />
                <input type="tel" placeholder="Phone Number" className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all text-sm" />
              </div>
              <input type="text" placeholder="Physical Address" className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all text-sm" />
              <div className="grid grid-cols-2 gap-4">
                <input type="password" placeholder="Password" className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all text-sm" />
                <input type="password" placeholder="Confirm" className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all text-sm" />
              </div>
              <button className="w-full py-4 bg-white text-indigo-700 rounded-2xl font-bold text-lg hover:bg-indigo-50 hover:scale-[1.02] active:scale-95 transition-all shadow-xl mt-6">
                Register Hospital
              </button>
            </form>

            <div className="mt-8 text-center border-t border-white/10 pt-6">
              <p className="text-sm text-white/70">
                Already registered? <Link to="/login" className="font-bold text-white hover:underline transition-all underline-offset-4">Login here</Link>
              </p>
            </div>
          </div>
          
          <div className="mt-10 text-center lg:text-right px-4">
            <p className="text-white/90 font-medium italic text-lg tracking-tight">Seamless Solutions for Healthcare Success</p>
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