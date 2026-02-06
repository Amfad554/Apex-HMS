import React, { useState } from 'react';
import { 
    Receipt, Search, Plus, Filter, 
    Download, MoreVertical, CheckCircle2, 
    Clock, AlertCircle, X, CreditCard 
} from "lucide-react";

export default function Billing() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    const [invoices, setInvoices] = useState([
        { id: "INV-8801", patient: "John Doe", date: "2024-03-15", amount: 1250.00, status: "Paid", method: "Insurance" },
        { id: "INV-8802", patient: "Alice Brown", date: "2024-03-18", amount: 450.00, status: "Pending", method: "Credit Card" },
        { id: "INV-8803", patient: "Mike Ross", date: "2024-03-20", amount: 2100.00, status: "Overdue", method: "Cash" },
    ]);

    const [formData, setFormData] = useState({
        patient: '', amount: '', method: 'Insurance', status: 'Pending'
    });

    // Filtering Logic
    const filteredInvoices = invoices.filter(inv => {
        const matchesSearch = inv.patient.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             inv.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "All" || inv.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleCreateInvoice = (e) => {
        e.preventDefault();
        const newInvoice = {
            ...formData,
            id: `INV-${Math.floor(8000 + Math.random() * 1000)}`,
            date: new Date().toISOString().split('T')[0],
            amount: parseFloat(formData.amount)
        };
        setInvoices([newInvoice, ...invoices]);
        setIsModalOpen(false);
        setFormData({ patient: '', amount: '', method: 'Insurance', status: 'Pending' });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Billing & Invoices</h2>
                    <p className="text-slate-500 text-sm">Monitor patient payments and financial records.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95"
                >
                    <Plus size={18} /> Create Invoice
                </button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by Invoice ID or Patient..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 shadow-sm"
                    />
                </div>
                <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-600 focus:ring-2 focus:ring-emerald-500 shadow-sm outline-none"
                >
                    <option value="All">All Status</option>
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Overdue">Overdue</option>
                </select>
            </div>

            {/* Invoice Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                            <th className="py-5 pl-8">Invoice ID</th>
                            <th className="py-5">Patient Name</th>
                            <th className="py-5">Amount</th>
                            <th className="py-5">Method</th>
                            <th className="py-5">Status</th>
                            <th className="py-5 pr-8 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredInvoices.map((inv) => (
                            <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-4 pl-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                            <Receipt size={18} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm">{inv.id}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">{inv.date}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 text-sm font-bold text-slate-700">{inv.patient}</td>
                                <td className="py-4 text-sm font-black text-slate-800">${inv.amount.toLocaleString()}</td>
                                <td className="py-4 text-xs font-semibold text-slate-500">{inv.method}</td>
                                <td className="py-4">
                                    <span className={`flex items-center gap-1.5 w-fit px-3 py-1 rounded-full text-[10px] font-bold ${
                                        inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-600' :
                                        inv.status === 'Pending' ? 'bg-amber-100 text-amber-600' :
                                        'bg-rose-100 text-rose-600'
                                    }`}>
                                        {inv.status === 'Paid' && <CheckCircle2 size={12} />}
                                        {inv.status === 'Pending' && <Clock size={12} />}
                                        {inv.status === 'Overdue' && <AlertCircle size={12} />}
                                        {inv.status}
                                    </span>
                                </td>
                                <td className="py-4 pr-8 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                                            <Download size={16} />
                                        </button>
                                        <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create Invoice Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800">New Invoice</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20}/></button>
                        </div>
                        <form onSubmit={handleCreateInvoice} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Patient Name</label>
                                <input required type="text" className="w-full mt-1.5 px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500" 
                                    value={formData.patient} onChange={(e) => setFormData({...formData, patient: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Total Amount ($)</label>
                                    <input required type="number" className="w-full mt-1.5 px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500" 
                                        value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Payment Method</label>
                                    <select className="w-full mt-1.5 px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500"
                                        value={formData.method} onChange={(e) => setFormData({...formData, method: e.target.value})}>
                                        <option>Insurance</option><option>Credit Card</option><option>Cash</option><option>Bank Transfer</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold mt-4 shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                                <CreditCard size={18} /> Generate Invoice
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}