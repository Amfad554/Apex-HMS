import React, { useState } from 'react';
import { 
    Package, 
    Search, 
    Plus, 
    AlertTriangle, 
    Filter, 
    MoreVertical, 
    TrendingDown, 
    Archive,
    X
} from "lucide-react";

export default function Pharmacy() {
    // 1. States for Data and Search
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All"); // To filter by In/Low/Out of stock
    
    const [inventory, setInventory] = useState([
        { id: "MED-001", name: "Paracetamol", category: "Analgesic", stock: 120, unit: "Packs", price: "$12.00", status: "In Stock" },
        { id: "MED-002", name: "Amoxicillin", category: "Antibiotic", stock: 8, unit: "Bottles", price: "$25.50", status: "Low Stock" },
        { id: "MED-003", name: "Insulin Pen", category: "Diabetes", stock: 0, unit: "Units", price: "$45.00", status: "Out of Stock" },
        { id: "SUP-001", name: "Surgical Masks", category: "Supplies", stock: 500, unit: "Box", price: "$15.00", status: "In Stock" },
    ]);

    // 2. Logic: Filter inventory based on search query AND status button
    const filteredInventory = inventory.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             item.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "All" || item.status === filterStatus;
        
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'In Stock': return 'bg-emerald-100 text-emerald-600';
            case 'Low Stock': return 'bg-amber-100 text-amber-600';
            case 'Out of Stock': return 'bg-rose-100 text-rose-600';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Pharmacy & Inventory</h2>
                    <p className="text-slate-500 text-sm">Monitor medical supplies and medication stock levels.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">
                        <Archive size={18} /> Export CSV
                    </button>
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                        <Plus size={18} /> Add Item
                    </button>
                </div>
            </div>

            {/* Quick Stats (Now Interactive!) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                    onClick={() => setFilterStatus("All")}
                    className={`p-5 rounded-3xl border transition-all flex items-center gap-4 ${filterStatus === "All" ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-800'}`}
                >
                    <div className={`p-3 rounded-2xl ${filterStatus === "All" ? 'bg-white/20' : 'bg-blue-50 text-blue-600'}`}><Package size={24} /></div>
                    <div className="text-left">
                        <p className={`text-xs font-bold uppercase ${filterStatus === "All" ? 'text-blue-100' : 'text-slate-400'}`}>Total Items</p>
                        <p className="text-xl font-black">412</p>
                    </div>
                </button>

                <button 
                    onClick={() => setFilterStatus("Low Stock")}
                    className={`p-5 rounded-3xl border transition-all flex items-center gap-4 ${filterStatus === "Low Stock" ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white border-slate-100 text-slate-800'}`}
                >
                    <div className={`p-3 rounded-2xl ${filterStatus === "Low Stock" ? 'bg-white/20' : 'bg-amber-50 text-amber-600'}`}><AlertTriangle size={24} /></div>
                    <div className="text-left">
                        <p className={`text-xs font-bold uppercase ${filterStatus === "Low Stock" ? 'text-amber-100' : 'text-slate-400'}`}>Low Stock</p>
                        <p className="text-xl font-black">12</p>
                    </div>
                </button>

                <button 
                    onClick={() => setFilterStatus("Out of Stock")}
                    className={`p-5 rounded-3xl border transition-all flex items-center gap-4 ${filterStatus === "Out of Stock" ? 'bg-rose-600 border-rose-600 text-white' : 'bg-white border-slate-100 text-slate-800'}`}
                >
                    <div className={`p-3 rounded-2xl ${filterStatus === "Out of Stock" ? 'bg-white/20' : 'bg-rose-50 text-rose-600'}`}><TrendingDown size={24} /></div>
                    <div className="text-left">
                        <p className={`text-xs font-bold uppercase ${filterStatus === "Out of Stock" ? 'text-rose-100' : 'text-slate-400'}`}>Out of Stock</p>
                        <p className="text-xl font-black">2</p>
                    </div>
                </button>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by name or ID..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500" 
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                <X size={16} />
                            </button>
                        )}
                    </div>
                    {filterStatus !== "All" && (
                        <div className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold">
                            Showing: {filterStatus}
                            <button onClick={() => setFilterStatus("All")}><X size={14}/></button>
                        </div>
                    )}
                </div>
                
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                            <th className="py-5 pl-8">Item Name</th>
                            <th className="py-5">Category</th>
                            <th className="py-5">Stock Level</th>
                            <th className="py-5">Unit Price</th>
                            <th className="py-5">Status</th>
                            <th className="py-5 pr-8 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredInventory.length > 0 ? (
                            filteredInventory.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 pl-8">
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">{item.id}</p>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-sm font-bold text-slate-700">{item.stock} {item.unit}</p>
                                            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full transition-all duration-500 ${item.stock > 50 ? 'bg-emerald-500' : item.stock > 0 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                                    style={{ width: `${Math.min((item.stock / 200) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 text-sm font-bold text-slate-600">{item.price}</td>
                                    <td className="py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="py-4 pr-8 text-right">
                                        <button className="text-slate-300 hover:text-slate-600"><MoreVertical size={18} /></button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="py-20 text-center">
                                    <div className="flex flex-col items-center gap-2 text-slate-400">
                                        <Search size={40} strokeWidth={1} />
                                        <p className="font-medium">No items found matching "{searchQuery}"</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}