import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate, BrowserRouter, Routes, Route } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Stethoscope,
  Pill,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X
} from "lucide-react";

// Sidebar Item Component
const SidebarItem = ({ icon: Icon, label, path, active, collapsed, onClick }) => (
  <Link
    to={path}
    onClick={onClick}
    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group
      ${active
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
        : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"}`}
  >
    <Icon size={22} strokeWidth={active ? 2.5 : 2} />
    {!collapsed && <span className="font-semibold text-sm tracking-wide">{label}</span>}
    {collapsed && (
      <div className="absolute left-20 bg-slate-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
        {label}
      </div>
    )}
  </Link>
);

// --- Pages ---

// Overview Page
const Overview = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
        <p className="text-gray-500">Upcoming Appointments</p>
        <h3 className="text-xl font-semibold mt-2">3</h3>
      </div>
      <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
        <p className="text-gray-500">Pending Prescriptions</p>
        <h3 className="text-xl font-semibold mt-2">2</h3>
      </div>
      <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
        <p className="text-gray-500">Medical Records</p>
        <h3 className="text-xl font-semibold mt-2">5</h3>
      </div>
    </div>
  </div>
);

// Appointments Page
const Appointments = () => {
  const appointments = [
    { id: 1, doctor: "Dr. John Doe", date: "2026-02-10", time: "10:00 AM", status: "Confirmed" },
    { id: 2, doctor: "Dr. Jane Smith", date: "2026-02-15", time: "2:00 PM", status: "Pending" },
    { id: 3, doctor: "Dr. Alex Brown", date: "2026-02-20", time: "11:30 AM", status: "Confirmed" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Appointments</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto bg-white rounded-xl shadow">
          <thead>
            <tr className="bg-indigo-50 text-left">
              <th className="px-4 py-3">Doctor</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(a => (
              <tr key={a.id} className="border-t hover:bg-indigo-50 transition">
                <td className="px-4 py-3">{a.doctor}</td>
                <td className="px-4 py-3">{a.date}</td>
                <td className="px-4 py-3">{a.time}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 text-sm rounded-full ${a.status === "Confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Prescriptions Page
const Prescriptions = () => {
  const prescriptions = [
    { id: 1, medicine: "Paracetamol", dosage: "500mg", frequency: "Twice a day" },
    { id: 2, medicine: "Amoxicillin", dosage: "250mg", frequency: "3 times a day" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Prescriptions</h2>
      <ul className="space-y-4">
        {prescriptions.map(p => (
          <li key={p.id} className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
            <p><span className="font-semibold">Medicine:</span> {p.medicine}</p>
            <p><span className="font-semibold">Dosage:</span> {p.dosage}</p>
            <p><span className="font-semibold">Frequency:</span> {p.frequency}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Medical Records Page
const Records = () => {
  const records = [
    { id: 1, type: "Blood Test", date: "2026-01-15" },
    { id: 2, type: "X-Ray", date: "2026-01-20" },
    { id: 3, type: "MRI Scan", date: "2026-01-25" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Medical Records</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {records.map(r => (
          <div key={r.id} className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
            <p><span className="font-semibold">Type:</span> {r.type}</p>
            <p><span className="font-semibold">Date:</span> {r.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Dashboard Layout ---
function  PatientDashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const userString = localStorage.getItem("user");
  const user = (userString && userString !== "undefined")
    ? JSON.parse(userString)
    : { hospitalName: "Guest", profileImage: null };

  const menuItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
    { icon: CalendarCheck, label: "Appointments", path: "/dashboard/appointments" },
    { icon: Pill, label: "Prescriptions", path: "/dashboard/prescriptions" },
    { icon: Users, label: "Medical Records", path: "/dashboard/records" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-slate-200 transition-all duration-300 flex flex-col z-40 ${collapsed ? "w-20" : "w-72"}`}>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shrink-0">
            <Stethoscope size={24} />
          </div>
          {!collapsed && <h1 className="text-2xl font-black text-slate-800 italic tracking-tighter">ApexHMS</h1>}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map(item => (
            <SidebarItem
              key={item.path}
              {...item}
              active={location.pathname === item.path}
              collapsed={collapsed}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-2">
          <SidebarItem icon={Settings} label="Settings" path="#" collapsed={collapsed} />
          <button onClick={handleLogout} className="w-full">
            <SidebarItem icon={LogOut} label="Logout" path="#" collapsed={collapsed} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-30">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors"
          >
            {collapsed ? <Menu /> : <X />}
          </button>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center bg-slate-100 px-4 py-2 rounded-2xl w-64 border border-transparent focus-within:border-indigo-300 transition-all">
              <Search size={18} className="text-slate-400" />
              <input type="text" placeholder="Search..." className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full text-slate-600 outline-none" />
            </div>

            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">{user.hospitalName}</p>
                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Patient</p>
              </div>
              {user.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-10 h-10 rounded-xl shadow-md object-cover border border-slate-100" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md">{user.hospitalName.charAt(0)}</div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default PatientDashboardLayout;
