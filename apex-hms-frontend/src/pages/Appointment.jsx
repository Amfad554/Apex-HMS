import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar as CalendarIcon, Clock, Stethoscope, Plus, X, CheckCircle2, Timer, Search, Loader2 } from "lucide-react";

export default function Appointments() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState([]);
    const [dropdownData, setDropdownData] = useState({ doctors: [], patients: [] });

    // Replace line 10 with this:
    const storedUser = localStorage.getItem("user");
    const user = (storedUser && storedUser !== "undefined")
        ? JSON.parse(storedUser)
        : null;
    const [formData, setFormData] = useState({
        patientId: '', staffId: '', time: '', date: '', type: 'General'
    });

    // --- FETCH DATA ---
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // 1. Get List of Doctors/Patients for the Modal
                const dataRes = await axios.get(`http://localhost:5000/api/appointment-data/${user.id}`);
                setDropdownData(dataRes.data);

                // 2. Get Existing Appointments
                const appRes = await axios.get(`http://localhost:5000/api/appointments/${user.id}`);
                setAppointments(appRes.data);
            } catch (err) {
                console.error("Load error", err);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, [user.id]);

    const handleBook = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/appointments', {
                ...formData,
                hospitalId: user.id
            });
            setAppointments([res.data, ...appointments]);
            setIsModalOpen(false);
        } catch (err) {
            alert("Check if all fields are selected correctly.");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            {/* Header omitted - same as yours */}

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {appointments.map((app) => (
                        <div key={app.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600">
                                    <Stethoscope size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800">
                                        {app.patient.firstName} {app.patient.lastName}
                                    </h4>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        with Dr. {app.staff.lastName} • <span className="font-bold text-indigo-600">General Visit</span>
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-1 text-slate-800 font-bold text-sm justify-end">
                                    <Clock size={14} className="text-slate-400" />
                                    {new Date(app.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <span className="text-[10px] bg-amber-100 text-amber-600 px-2 py-1 rounded-full font-bold uppercase">
                                    {app.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal with Real Selects */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8">
                        <h3 className="text-xl font-bold mb-6">Book Appointment</h3>
                        <form onSubmit={handleBook} className="space-y-4">
                            {/* Select Patient */}
                            <select required className="w-full p-3 bg-slate-50 rounded-2xl"
                                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}>
                                <option value="">Select Patient</option>
                                {dropdownData.patients.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
                            </select>

                            {/* Select Doctor */}
                            <select required className="w-full p-3 bg-slate-50 rounded-2xl"
                                onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}>
                                <option value="">Select Doctor</option>
                                {dropdownData.doctors.map(d => <option key={d.id} value={d.id}>Dr. {d.lastName}</option>)}
                            </select>

                            <div className="grid grid-cols-2 gap-4">
                                <input required type="date" className="p-3 bg-slate-50 rounded-2xl" onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                                <input required type="time" className="p-3 bg-slate-50 rounded-2xl" onChange={(e) => setFormData({ ...formData, time: e.target.value })} />
                            </div>

                            <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold">Confirm Appointment</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}