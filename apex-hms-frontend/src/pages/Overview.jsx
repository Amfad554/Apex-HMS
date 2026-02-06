import React, { useState } from 'react'; // Added useState
import { useNavigate } from "react-router-dom";
import {
    Users,
    Calendar,
    Activity,
    ArrowUpRight,
    UserPlus,
    ClipboardList,
    Stethoscope,
    TrendingUp,
    Clock,
    Search // Added Search icon
} from "lucide-react";

const StatCard = ({ title, value, icon: Icon, trend, color, onClick }) => (
    <div
        onClick={onClick}
        className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
    >
        <div className="flex items-start justify-between">
            <div className={`p-3 rounded-2xl ${color} text-white shadow-lg transition-transform group-hover:scale-110`}>
                <Icon size={24} />
            </div>
            <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg text-xs font-bold">
                <ArrowUpRight size={14} />
                {trend}
            </div>
        </div>
        <div className="mt-4">
            <p className="text-slate-500 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">{value}</h3>
        </div>
    </div>
);

export default function Overview() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState(""); // State for search

    const stats = {
        totalPatients: "1,284",
        activeAppointments: "42",
        staffCount: "18",
        revenue: "$4,120"
    };

    const recentAdmissions = [
        { id: "P-1001", name: "John Doe", time: "09:30 AM", status: "In Consultation", doctor: "Dr. Robert Fox" },
        { id: "P-1002", name: "Alice Brown", time: "10:15 AM", status: "Waiting", doctor: "Dr. Sarah Smith" },
        { id: "P-1003", name: "Mike Ross", time: "11:00 AM", status: "Completed", doctor: "Dr. Robert Fox" },
    ];

    // Search Logic
    const filteredAdmissions = recentAdmissions.filter(patient =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.doctor.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Hospital Vitals</h2>
                    <p className="text-slate-500 text-sm">Real-time status of ApexHMS operations.</p>
                </div>
                <div className="hidden md:flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl">
                    <Clock size={14} /> System Live: 03:14 PM
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Patients" value={stats.totalPatients} icon={Users} trend="+12%" color="bg-blue-600"
                    onClick={() => navigate("/dashboard/patients")}
                />
                <StatCard
                    title="Appointments" value={stats.activeAppointments} icon={Calendar} trend="+5%" color="bg-indigo-600"
                    onClick={() => navigate("/dashboard/appointments")}
                />
                <StatCard
                    title="Active Staff" value={stats.staffCount} icon={Activity} trend="Stable" color="bg-purple-600"
                    onClick={() => navigate("/dashboard/staff")}
                />
                <StatCard
                    title="Daily Revenue" value={stats.revenue} icon={ClipboardList} trend="+18%" color="bg-slate-800"
                    onClick={() => { }} // Placeholder
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Admissions Table */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                        <h3 className="text-lg font-bold text-slate-800">Live Patient Flow</h3>

                        {/* Working Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search flow..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-slate-400 text-[10px] uppercase tracking-widest border-b border-slate-50">
                                    <th className="pb-4 font-black">Patient</th>
                                    <th className="pb-4 font-black">Time</th>
                                    <th className="pb-4 font-black">Doctor</th>
                                    <th className="pb-4 font-black">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredAdmissions.length > 0 ? (
                                    filteredAdmissions.map((patient, i) => (
                                        <tr key={i} className="group hover:bg-slate-50 transition-colors cursor-default">
                                            <td className="py-4">
                                                <p className="font-bold text-slate-800 text-sm">{patient.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold">{patient.id}</p>
                                            </td>
                                            <td className="py-4 text-sm text-slate-600 font-medium">{patient.time}</td>
                                            <td className="py-4 text-sm text-slate-600 font-medium">{patient.doctor}</td>
                                            <td className="py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${patient.status === 'Waiting' ? 'bg-amber-100 text-amber-600' :
                                                        patient.status === 'In Consultation' ? 'bg-blue-100 text-blue-600' :
                                                            'bg-emerald-100 text-emerald-600'
                                                    }`}>
                                                    {patient.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-8 text-center text-slate-400 text-xs italic">
                                            No matches found for "{searchQuery}"
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions Panel */}
                <div className="space-y-6">
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
                        <Stethoscope className="absolute -right-4 -bottom-4 text-white/5 rotate-12 group-hover:scale-110 transition-transform" size={120} />
                        <h3 className="text-lg font-bold mb-2">Admin Actions</h3>
                        <p className="text-slate-400 text-sm mb-6 font-medium">Common tasks for Sarah Smith</p>

                        <div className="space-y-3 relative z-10">
                            <button
                                onClick={() => navigate("/dashboard/staff")}
                                className="w-full flex items-center justify-between bg-white/10 hover:bg-white hover:text-slate-900 p-4 rounded-2xl transition-all font-bold text-sm"
                            >
                                <div className="flex items-center gap-3"><Stethoscope size={18} /> Manage Staff</div>
                                <ArrowUpRight size={16} />
                            </button>

                            <button
                                onClick={() => navigate("/dashboard/patients")}
                                className="w-full flex items-center justify-between bg-white/10 hover:bg-white hover:text-slate-900 p-4 rounded-2xl transition-all font-bold text-sm"
                            >
                                <div className="flex items-center gap-3"><UserPlus size={18} /> Register Patient</div>
                                <ArrowUpRight size={16} />
                            </button>

                            <button
                                onClick={() => navigate("/dashboard/appointments")}
                                className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white p-4 rounded-2xl transition-all font-black text-sm shadow-lg hover:bg-indigo-700"
                            >
                                <TrendingUp size={18} /> View Reports
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}