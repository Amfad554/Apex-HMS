import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Search, UserPlus, MoreVertical,
    Stethoscope, Mail, X, Activity,
    Loader2, AlertCircle, CheckCircle2, Trash2,
    Save, Copy
} from "lucide-react";

export default function Staff() {
    // --- UI & FEEDBACK STATES ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [staffToDelete, setStaffToDelete] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [toast, setToast] = useState(null);

    // --- DATA STATES ---
    const [searchQuery, setSearchQuery] = useState("");
    const [filterDept, setFilterDept] = useState("All");
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userString = localStorage.getItem("user");
    const currentUser = userString ? JSON.parse(userString) : null;

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '',
        password: '', role: 'DOCTOR',
        department: 'General Medicine', specialization: ''
    });

    // --- FETCH DATA ---
    const fetchStaff = async () => {
        if (!currentUser?.id) return;
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:5000/api/staff/${currentUser.id}`);
            setStaff(res.data);
        } catch (err) {
            setError("Could not load staff directory.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStaff(); }, [currentUser?.id]);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    // --- HANDLERS ---

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setToast({ message: "Staff ID copied to clipboard!", type: "info" });
    };

    const handleAddStaff = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const res = await axios.post('http://localhost:5000/api/staff', {
                ...formData, hospitalId: currentUser.id
            });
            setShowSuccess(true);
            setStaff(prev => [res.data, ...prev]);
            setTimeout(() => {
                setIsModalOpen(false);
                setShowSuccess(false);
                setIsSubmitting(false);
                setToast({ message: "Staff member onboarded successfully!", type: "success" });
                setFormData({ firstName: '', lastName: '', email: '', password: '', role: 'DOCTOR', department: 'General Medicine' });
            }, 1500);
        } catch (err) {
            setIsSubmitting(false);
            const errorMsg = err.response?.data?.message || "Failed to add staff member.";
            setToast({ message: errorMsg, type: "error" });
        }
    };

    const handleUpdateStaff = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const res = await axios.put(`http://localhost:5000/api/staff/${selectedStaff.id}`, formData);
            setStaff(staff.map(s => s.id === selectedStaff.id ? res.data : s));
            setShowSuccess(true);
            setTimeout(() => {
                setIsEditMode(false);
                setShowSuccess(false);
                setIsSubmitting(false);
                setSelectedStaff(res.data);
                setToast({ message: "Profile updated successfully!", type: "success" });
            }, 1500);
        } catch (err) {
            setIsSubmitting(false);
            const errorMsg = err.response?.data?.message || "Update failed.";
            setToast({ message: errorMsg, type: "error" });
        }
    };

    const handleDelete = async () => {
        try {
            setIsSubmitting(true);
            await axios.delete(`http://localhost:5000/api/staff/${staffToDelete.id}`);
            setStaff(staff.filter(m => m.id !== staffToDelete.id));
            setToast({ message: "Staff account removed.", type: "success" });
            setIsDeleteModalOpen(false);
        } catch (err) {
            setToast({ message: "Deletion failed.", type: "error" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const startEditing = () => {
        setFormData({
            firstName: selectedStaff.firstName,
            lastName: selectedStaff.lastName,
            email: selectedStaff.email,
            role: selectedStaff.role,
            department: selectedStaff.department
        });
        setIsEditMode(true);
    };

    const filteredStaff = staff.filter(s => {
        const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
        return (fullName.includes(searchQuery.toLowerCase()) || s.id.toLowerCase().includes(searchQuery.toLowerCase())) &&
               (filterDept === "All" || s.department === filterDept);
    });

    return (
        <div className="space-y-6 relative min-h-screen pb-20">
            
            {/* --- PROFESSIONAL TOAST SYSTEM --- */}
            {toast && (
                <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top duration-300">
                    <div className={`px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm border 
                        ${toast.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                          toast.type === 'error' ? 'bg-red-50 text-red-700 border-red-100' : 
                          'bg-slate-900 text-white border-transparent'}`}>
                        {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        {toast.message}
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Medical Staff</h2>
                    <p className="text-slate-500 text-sm font-medium">Manage your hospital's professional directory</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:bg-indigo-700 transition-all active:scale-95">
                    <UserPlus size={18} /> Add Staff
                </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="Search by name or ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-sm" />
                </div>
                <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="px-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-600 outline-none shadow-sm cursor-pointer">
                    <option value="All">All Departments</option>
                    <option>Cardiology</option><option>Neurology</option><option>Pediatrics</option><option>General Medicine</option>
                </select>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="animate-spin text-indigo-600" size={40} />
                    <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Accessing Directory...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStaff.map((member) => (
                        <div key={member.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                    {member.role === "DOCTOR" ? <Stethoscope size={24} /> : <Activity size={24} />}
                                </div>
                                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-600">Active</span>
                            </div>
                            <h4 className="font-bold text-slate-800 text-lg leading-tight">{member.firstName} {member.lastName}</h4>
                            <p className="text-indigo-600 text-[10px] font-black uppercase tracking-widest mt-1 mb-6">{member.role} • {member.department}</p>
                            
                            <div className="flex gap-2">
                                <button onClick={() => setSelectedStaff(member)} className="flex-1 py-3 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-500 rounded-xl text-xs font-bold transition-all active:scale-95">View Profile</button>
                                <button onClick={() => { setStaffToDelete(member); setIsDeleteModalOpen(true); }} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-95"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- ADD STAFF MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => !isSubmitting && setIsModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10 animate-in zoom-in duration-200">
                        <button onClick={() => setIsModalOpen(false)} className="absolute right-8 top-8 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-all"><X size={20} /></button>
                        <div className="mb-8 text-center">
                            <h3 className="text-2xl font-black text-slate-800">Onboard Staff</h3>
                            <p className="text-sm text-slate-500 font-medium">Register a new medical professional</p>
                        </div>
                        <form onSubmit={handleAddStaff} className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">First Name</label>
                                <input required className="p-4 bg-slate-50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 border border-transparent transition-all"
                                    value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Last Name</label>
                                <input required className="p-4 bg-slate-50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 border border-transparent transition-all"
                                    value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                            </div>
                            <div className="col-span-2 flex flex-col gap-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Email</label>
                                <input required type="email" className="p-4 bg-slate-50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 border border-transparent transition-all"
                                    value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div className="col-span-2 flex flex-col gap-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Password</label>
                                <input required type="password" placeholder="••••••••" className="p-4 bg-slate-50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 border border-transparent transition-all"
                                    value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Role</label>
                                <select className="p-4 bg-slate-50 rounded-2xl text-sm outline-none cursor-pointer"
                                    value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                                    <option value="DOCTOR">Doctor</option>
                                    <option value="NURSE">Nurse</option>
                                    <option value="RECEPTIONIST">Receptionist</option>
                                    <option value="ADMIN">Staff Admin</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Department</label>
                                <select className="p-4 bg-slate-50 rounded-2xl text-sm outline-none cursor-pointer"
                                    value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })}>
                                    <option>General Medicine</option>
                                    <option>Cardiology</option>
                                    <option>Neurology</option>
                                    <option>Pediatrics</option>
                                </select>
                            </div>
                            <button type="submit" disabled={isSubmitting || showSuccess}
                                className={`col-span-2 py-4 rounded-2xl font-bold mt-6 transition-all flex items-center justify-center gap-2 shadow-lg 
                                    ${showSuccess ? "bg-green-500 text-white" : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 disabled:bg-slate-300"}`} >
                                {isSubmitting && !showSuccess && <Loader2 className="animate-spin" size={20} />}
                                {showSuccess ? <CheckCircle2 size={20} /> : null}
                                {showSuccess ? "Staff Member Registered!" : isSubmitting ? "Processing..." : "Complete Onboarding"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- PROFILE / EDIT MODAL --- */}
            {selectedStaff && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => !isSubmitting && setSelectedStaff(null)}></div>
                    <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                        <div className="h-24 bg-indigo-600 relative">
                             <button onClick={() => setSelectedStaff(null)} className="absolute right-6 top-6 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-all"><X size={20} /></button>
                        </div>
                        <div className="px-10 pb-10">
                            <div className="relative -mt-12 mb-6 flex items-end justify-between">
                                <div className="w-24 h-24 rounded-[2rem] bg-white p-2 shadow-xl">
                                    <div className="w-full h-full rounded-[1.5rem] bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-2xl">
                                        {selectedStaff.firstName[0]}{selectedStaff.lastName[0]}
                                    </div>
                                </div>
                                {!isEditMode && (
                                    <button onClick={startEditing} className="mb-2 px-6 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-xs hover:bg-indigo-100 transition-all active:scale-95">Edit Details</button>
                                )}
                            </div>

                            {!isEditMode ? (
                                <div className="animate-in fade-in duration-300">
                                    <h3 className="text-3xl font-black text-slate-800">{selectedStaff.firstName} {selectedStaff.lastName}</h3>
                                    <p className="text-indigo-600 font-bold uppercase tracking-widest text-sm mb-8">{selectedStaff.role} — {selectedStaff.department}</p>
                                    <div className="grid grid-cols-2 gap-8 border-t border-slate-100 pt-8">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                                            <p className="text-sm font-bold text-slate-700">{selectedStaff.email}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Staff ID</p>
                                            <div className="flex items-center gap-2 group">
                                                <p className="text-sm font-bold text-slate-700">{selectedStaff.id.slice(0, 12)}...</p>
                                                <button onClick={() => copyToClipboard(selectedStaff.id)} className="text-slate-300 hover:text-indigo-600 transition-all"><Copy size={14}/></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleUpdateStaff} className="animate-in slide-in-from-bottom-4 duration-300">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase">First Name</label>
                                            <input className="p-4 bg-slate-50 rounded-2xl text-sm outline-none border border-transparent focus:border-indigo-500" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase">Last Name</label>
                                            <input className="p-4 bg-slate-50 rounded-2xl text-sm outline-none border border-transparent focus:border-indigo-500" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase">Role</label>
                                            <select className="p-4 bg-slate-50 rounded-2xl text-sm outline-none" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                                                <option value="DOCTOR">Doctor</option><option value="NURSE">Nurse</option><option value="RECEPTIONIST">Receptionist</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase">Department</label>
                                            <select className="p-4 bg-slate-50 rounded-2xl text-sm outline-none" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
                                                <option>General Medicine</option><option>Cardiology</option><option>Neurology</option>
                                            </select>
                                        </div>
                                        <div className="col-span-2 flex gap-3 mt-4">
                                            <button type="button" onClick={() => setIsEditMode(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">Cancel</button>
                                            <button type="submit" disabled={isSubmitting} className={`flex-1 py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all ${showSuccess ? 'bg-green-500' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg active:scale-95'}`}>
                                                {isSubmitting && !showSuccess ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                                {showSuccess ? "Updated!" : "Save Changes"}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* --- DELETE MODAL --- */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsDeleteModalOpen(false)}></div>
                    <div className="relative bg-white max-w-sm w-full rounded-[2.5rem] p-8 text-center shadow-2xl animate-in zoom-in duration-200">
                        <button onClick={() => setIsDeleteModalOpen(false)} className="absolute right-6 top-6 p-2 text-slate-300 hover:text-slate-500 transition-all"><X size={18} /></button>
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><AlertCircle size={32} /></div>
                        <h3 className="text-xl font-black text-slate-800">Remove Staff?</h3>
                        <p className="text-sm text-slate-500 mt-2 font-medium">Deactivating <span className="text-slate-800 font-bold">{staffToDelete?.firstName}</span> will restrict their access to the portal.</p>
                        <div className="grid grid-cols-2 gap-3 mt-8">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="py-3 rounded-2xl bg-slate-100 font-bold text-slate-600 text-xs hover:bg-slate-200 transition-all">CANCEL</button>
                            <button onClick={handleDelete} className="py-3 rounded-2xl bg-red-500 font-bold text-white text-xs hover:bg-red-600 transition-all active:scale-95">CONFIRM</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}