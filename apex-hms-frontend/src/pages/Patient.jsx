import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    UserPlus, Search, MoreVertical,
    Droplets, X, User, Loader2, CheckCircle2, 
    Trash2, AlertCircle, ShieldAlert, FileText, 
    Calendar, Phone, ClipboardList
} from "lucide-react";

export default function Patients() {
    // --- UI STATES ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null); // For Profile View
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [patientToDelete, setPatientToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [toast, setToast] = useState(null);

    // --- DATA STATES ---
    const [patients, setPatients] = useState([]);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', gender: 'Male',
        dateOfBirth: '', bloodGroup: 'O+', phone: '',
        allergies: '', medicalHistory: '' // Added both sections
    });

    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const user = (storedUser && storedUser !== "undefined") ? JSON.parse(storedUser) : null;

    // --- FETCH DATA ---
    useEffect(() => {
        if (!user?.id || !token) { setLoading(false); return; }
        const fetchPatients = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/patients/${user.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPatients(res.data);
            } catch (err) { console.error(err); } 
            finally { setLoading(false); }
        };
        fetchPatients();
    }, [user?.id, token]);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    // --- HANDLERS ---
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const res = await axios.post('http://localhost:5000/api/patients',
                { ...formData, hospitalId: user.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setShowSuccess(true);
            setPatients([res.data, ...patients]);
            setTimeout(() => {
                setIsModalOpen(false);
                setShowSuccess(false);
                setIsSubmitting(false);
                setToast({ message: "Patient Admitted Successfully!", type: "success" });
                setFormData({ firstName: '', lastName: '', gender: 'Male', dateOfBirth: '', bloodGroup: 'O+', phone: '', allergies: '', medicalHistory: '' });
            }, 1500);
        } catch (err) {
            setToast({ message: "Registration failed.", type: "error" });
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            setIsSubmitting(true);
            await axios.delete(`http://localhost:5000/api/patients/${patientToDelete.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPatients(patients.filter(p => p.id !== patientToDelete.id));
            setIsDeleteModalOpen(false);
            setToast({ message: "Patient record deleted.", type: "info" });
        } catch (err) { setToast({ message: "Error deleting record.", type: "error" }); } 
        finally { setIsSubmitting(false); setPatientToDelete(null); }
    };

    const calculateAge = (dob) => {
        if (!dob) return "N/A";
        return Math.abs(new Date(Date.now() - new Date(dob).getTime()).getUTCFullYear() - 1970);
    };

    const filteredPatients = patients.filter(p =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 relative pb-10">
            {/* Toast System */}
            {toast && (
                <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top duration-300">
                    <div className={`px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-white'}`}>
                        {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        {toast.message}
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Patient Registry</h1>
                    <p className="text-sm text-slate-500 font-medium">Manage facility admissions & clinical history</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder="Search..." className="pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm w-64 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg active:scale-95">
                        <UserPlus size={20} /> Add Patient
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                            <th className="py-5 pl-8 text-center">Info</th>
                            <th className="py-5">Patient Details</th>
                            <th className="py-5">Clinical Alert</th>
                            <th className="py-5">Contact</th>
                            <th className="py-5 pr-8 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            <tr><td colSpan="5" className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-500" size={32} /></td></tr>
                        ) : filteredPatients.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => setSelectedPatient(p)}>
                                <td className="py-4 pl-8">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <User size={18} />
                                    </div>
                                </td>
                                <td className="py-4">
                                    <p className="font-bold text-slate-800 text-sm">{p.firstName} {p.lastName}</p>
                                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{calculateAge(p.dateOfBirth)} Yrs • {p.gender}</p>
                                </td>
                                <td className="py-4">
                                    <div className="flex gap-1">
                                        <span className="text-red-600 font-bold text-[10px] bg-red-50 px-2 py-0.5 rounded-md">{p.bloodGroup}</span>
                                        {p.allergies && <span className="text-amber-600 font-bold text-[10px] bg-amber-50 px-2 py-0.5 rounded-md flex items-center gap-1"><ShieldAlert size={10}/> Allergy</span>}
                                    </div>
                                </td>
                                <td className="py-4 text-sm text-slate-500 font-medium">{p.phone || "---"}</td>
                                <td className="py-4 pr-8 text-right" onClick={(e) => e.stopPropagation()}>
                                    <button onClick={() => { setPatientToDelete(p); setIsDeleteModalOpen(true); }} className="p-2 text-slate-300 hover:text-red-500 transition-all">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- ADMISSION MODAL (With Medical History) --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => !isSubmitting && setIsModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl p-10 max-h-[90vh] overflow-y-auto animate-in zoom-in duration-200">
                        <button onClick={() => setIsModalOpen(false)} className="absolute right-8 top-8 text-slate-300 hover:text-slate-600"><X size={20}/></button>
                        <h3 className="text-2xl font-black text-slate-800 mb-6">Patient Admission</h3>
                        <form onSubmit={handleRegister} className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase">First Name</label>
                                <input required className="p-4 bg-slate-50 rounded-2xl text-sm outline-none" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase">Last Name</label>
                                <input required className="p-4 bg-slate-50 rounded-2xl text-sm outline-none" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase">DOB</label>
                                <input required type="date" className="p-4 bg-slate-50 rounded-2xl text-sm outline-none" value={formData.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase">Phone</label>
                                <input className="p-4 bg-slate-50 rounded-2xl text-sm outline-none" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                            <div className="col-span-2 grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase">Gender</label>
                                    <select className="p-4 bg-slate-50 rounded-2xl text-sm" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                                        <option>Male</option><option>Female</option><option>Other</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase">Blood Group</label>
                                    <select className="p-4 bg-slate-50 rounded-2xl text-sm" value={formData.bloodGroup} onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}>
                                        <option>O+</option><option>O-</option><option>A+</option><option>B+</option><option>AB+</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-span-2">
                                <label className="text-[10px] font-black text-red-500 uppercase">Allergies</label>
                                <textarea placeholder="Known allergies..." className="w-full p-4 bg-red-50/30 border border-red-100 rounded-2xl text-sm min-h-[60px]" value={formData.allergies} onChange={(e) => setFormData({ ...formData, allergies: e.target.value })} />
                            </div>
                            <div className="col-span-2">
                                <label className="text-[10px] font-black text-blue-500 uppercase">Medical History</label>
                                <textarea placeholder="Previous surgeries, chronic conditions, etc..." className="w-full p-4 bg-blue-50/30 border border-blue-100 rounded-2xl text-sm min-h-[100px]" value={formData.medicalHistory} onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })} />
                            </div>
                            <button type="submit" disabled={isSubmitting} className="col-span-2 py-4 rounded-2xl font-bold bg-blue-600 text-white mt-4 hover:bg-blue-700 transition-all flex justify-center items-center gap-2">
                                {isSubmitting ? <Loader2 className="animate-spin" size={20}/> : "Confirm Admission"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- PATIENT PROFILE VIEW MODAL --- */}
            {selectedPatient && (
                <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl" onClick={() => setSelectedPatient(null)}></div>
                    <div className="relative bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                        <div className="bg-blue-600 p-12 text-white relative">
                            <button onClick={() => setSelectedPatient(null)} className="absolute right-8 top-8 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-all"><X size={20}/></button>
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-blue-600 text-3xl font-black">
                                    {selectedPatient.firstName[0]}{selectedPatient.lastName[0]}
                                </div>
                                <div>
                                    <h2 className="text-4xl font-black">{selectedPatient.firstName} {selectedPatient.lastName}</h2>
                                    <div className="flex gap-3 mt-2 opacity-80 font-bold text-sm uppercase tracking-widest">
                                        <span>ID: {selectedPatient.id.substring(0, 10)}</span>
                                        <span>•</span>
                                        <span>Patient Record</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-12 grid grid-cols-3 gap-8">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <Calendar className="text-blue-500" size={18}/>
                                    <div><p className="text-[10px] font-black text-slate-400 uppercase">Age / DOB</p><p className="text-sm font-bold text-slate-700">{calculateAge(selectedPatient.dateOfBirth)} Yrs ({selectedPatient.dateOfBirth})</p></div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="text-blue-500" size={18}/>
                                    <div><p className="text-[10px] font-black text-slate-400 uppercase">Contact</p><p className="text-sm font-bold text-slate-700">{selectedPatient.phone || "Not Provided"}</p></div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Droplets className="text-red-500" size={18}/>
                                    <div><p className="text-[10px] font-black text-slate-400 uppercase">Blood Type</p><p className="text-sm font-bold text-red-600">{selectedPatient.bloodGroup}</p></div>
                                </div>
                            </div>
                            <div className="col-span-2 space-y-8 border-l border-slate-100 pl-8">
                                <div>
                                    <h4 className="flex items-center gap-2 text-red-500 font-black text-xs uppercase tracking-widest mb-3"><ShieldAlert size={16}/> Allergies</h4>
                                    <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-sm font-medium border border-red-100 italic">
                                        {selectedPatient.allergies || "No known clinical allergies recorded."}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest mb-3"><ClipboardList size={16}/> Medical History</h4>
                                    <div className="p-4 bg-slate-50 text-slate-600 rounded-2xl text-sm font-medium border border-slate-100 leading-relaxed whitespace-pre-wrap">
                                        {selectedPatient.medicalHistory || "No previous history recorded for this patient."}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 bg-slate-50 flex justify-end">
                            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-100 transition-all">
                                <FileText size={16}/> Download Report
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal omitted for brevity (Keep your existing one) */}
             {/* --- DELETE CONFIRMATION MODAL --- */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsDeleteModalOpen(false)}></div>
                    <div className="relative bg-white max-w-sm w-full rounded-[2.5rem] p-8 text-center shadow-2xl animate-in zoom-in duration-200">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle size={32} />
                        </div>
                        <h3 className="text-xl font-black text-slate-800">Delete Record?</h3>
                        <p className="text-sm text-slate-500 mt-2">Are you sure you want to remove <span className="font-bold">{patientToDelete?.firstName}</span>? This cannot be undone.</p>
                        <div className="grid grid-cols-2 gap-3 mt-8">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="py-3 rounded-2xl bg-slate-100 font-bold text-slate-600 hover:bg-slate-200 transition-all">Cancel</button>
                            <button onClick={handleDelete} disabled={isSubmitting} className="py-3 rounded-2xl bg-red-500 font-bold text-white hover:bg-red-600 transition-all flex items-center justify-center">
                                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}



      