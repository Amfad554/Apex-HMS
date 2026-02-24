import { useState } from 'react';
import { Plus, Search, X, Pill, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import { ACCENT, BLUE, BLUE2 } from '../theme.js';
import { MOCK_PRESCRIPTIONS, MOCK_PATIENTS, MOCK_STAFF } from '../MockData.js';

const STATUS_COLORS = {
    Active: { bg: 'rgba(16,185,129,0.15)', text: '#34d399' },
    Dispensed: { bg: 'rgba(59,130,246,0.15)', text: '#60a5fa' },
    Expired: { bg: 'rgba(239,68,68,0.15)', text: '#f87171' },
};

export default function Pharmacy({ isDark, t }) {
    const [prescriptions, setRx] = useState(MOCK_PRESCRIPTIONS);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ patientName: '', doctor: '', drug: '', dosage: '', duration: '', status: 'Active' });
    const [formError, setFormError] = useState('');

    const doctors = MOCK_STAFF.filter(s => s.role === 'Doctor');

    const filtered = prescriptions.filter(rx => {
        const matchSearch = rx.patientName.toLowerCase().includes(search.toLowerCase()) || rx.drug.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filter === 'All' || rx.status === filter;
        return matchSearch && matchStatus;
    });

    const handleAdd = (e) => {
        e.preventDefault();
        if (!form.patientName || !form.drug || !form.dosage) { setFormError('Please fill all required fields.'); return; }
        const newRx = {
            id: `RX-00${prescriptions.length + 6}`,
            ...form,
            patientId: 'P-NEW',
            avatar: form.patientName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
            color: ACCENT.blue,
            date: new Date().toISOString().split('T')[0],
        };
        // TODO: await fetch('/api/prescriptions', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(newRx) })
        setRx(prev => [newRx, ...prev]);
        setShowAdd(false);
        setForm({ patientName: '', doctor: '', drug: '', dosage: '', duration: '', status: 'Active' });
        setFormError('');
    };

    const markDispensed = (id) => {
        // TODO: await fetch(`/api/prescriptions/${id}`, { method: 'PATCH', body: JSON.stringify({ status: 'Dispensed' }) })
        setRx(prev => prev.map(rx => rx.id === id ? { ...rx, status: 'Dispensed' } : rx));
    };

    const handleDelete = (id) => {
        // TODO: await fetch(`/api/prescriptions/${id}`, { method: 'DELETE' })
        setRx(prev => prev.filter(rx => rx.id !== id));
    };

    const inputStyle = { width: '100%', background: t.input, border: `1px solid ${t.border}`, borderRadius: 10, padding: '10px 14px', color: t.text, fontSize: 13, outline: 'none', fontFamily: 'inherit' };
    const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: t.textSub, marginBottom: 6 };

    const counts = { Active: 0, Dispensed: 0, Expired: 0 };
    prescriptions.forEach(rx => { if (counts[rx.status] !== undefined) counts[rx.status]++; });

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 4 }}>Pharmacy</h1>
                    <p style={{ color: t.textSub, fontSize: 14 }}>Manage prescriptions and medication dispensing</p>
                </div>
                <button onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: `linear-gradient(135deg, ${BLUE}, ${BLUE2})`, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(59,91,219,0.35)' }}>
                    <Plus size={17} /> Add Prescription
                </button>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                {[
                    { label: 'Active', count: counts.Active, color: ACCENT.green, icon: Pill },
                    { label: 'Dispensed', count: counts.Dispensed, color: ACCENT.blue, icon: CheckCircle2 },
                    { label: 'Expired', count: counts.Expired, color: ACCENT.red, icon: Clock },
                ].map(({ label, count, color, icon: Icon }) => (
                    <div key={label} style={{ background: t.card, borderRadius: 14, padding: '18px 20px', border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 42, height: 42, borderRadius: 12, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon size={20} color={color} />
                        </div>
                        <div>
                            <p style={{ fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{count}</p>
                            <p style={{ fontSize: 12, color: t.textSub, marginTop: 3 }}>{label} Prescriptions</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: t.card, borderRadius: 10, padding: '8px 14px', border: `1px solid ${t.border}`, flex: 1, minWidth: 200 }}>
                    <Search size={15} color={t.textMuted} />
                    <input placeholder="Search by patient or drug..." value={search} onChange={e => setSearch(e.target.value)}
                        style={{ background: 'none', border: 'none', outline: 'none', color: t.text, fontSize: 13, width: '100%', fontFamily: 'inherit' }} />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    {['All', 'Active', 'Dispensed', 'Expired'].map(s => (
                        <button key={s} onClick={() => setFilter(s)} style={{ padding: '8px 16px', borderRadius: 10, border: `1px solid ${filter === s ? BLUE : t.border}`, background: filter === s ? 'rgba(59,91,219,0.15)' : t.card, color: filter === s ? '#60a5fa' : t.textSub, fontWeight: filter === s ? 600 : 400, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>{s}</button>
                    ))}
                </div>
            </div>

            {/* Prescription List */}
            <div style={{ background: t.card, borderRadius: 18, border: `1px solid ${t.border}`, boxShadow: t.shadow, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: t.cardAlt }}>
                            {['Patient', 'Drug', 'Dosage', 'Duration', 'Doctor', 'Date', 'Status', 'Actions'].map(h => (
                                <th key={h} style={{ padding: '12px 18px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr><td colSpan={8} style={{ padding: 40, textAlign: 'center', color: t.textMuted, fontSize: 14 }}>No prescriptions found</td></tr>
                        ) : filtered.map(rx => {
                            const sc = STATUS_COLORS[rx.status] || STATUS_COLORS.Active;
                            return (
                                <tr key={rx.id} style={{ borderBottom: `1px solid ${t.border}`, transition: 'background 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = t.hover}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '14px 18px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{ width: 30, height: 30, borderRadius: 8, background: rx.color + '22', color: rx.color, fontWeight: 700, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{rx.avatar}</div>
                                            <div>
                                                <p style={{ fontWeight: 600, fontSize: 13 }}>{rx.patientName}</p>
                                                <p style={{ fontSize: 10, color: t.textMuted }}>{rx.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 18px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Pill size={13} color={ACCENT.violet} />
                                            <span style={{ fontSize: 13, fontWeight: 600 }}>{rx.drug}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 18px', fontSize: 12, color: t.textSub }}>{rx.dosage}</td>
                                    <td style={{ padding: '14px 18px', fontSize: 12, color: t.textSub, whiteSpace: 'nowrap' }}>{rx.duration}</td>
                                    <td style={{ padding: '14px 18px', fontSize: 12, color: t.textSub }}>{rx.doctor}</td>
                                    <td style={{ padding: '14px 18px', fontSize: 12, color: t.textMuted, whiteSpace: 'nowrap' }}>{rx.date}</td>
                                    <td style={{ padding: '14px 18px' }}>
                                        <span style={{ background: sc.bg, color: sc.text, fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20 }}>{rx.status}</span>
                                    </td>
                                    <td style={{ padding: '14px 18px' }}>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            {rx.status === 'Active' && (
                                                <button onClick={() => markDispensed(rx.id)} style={{ padding: '4px 10px', background: 'rgba(59,130,246,0.1)', border: 'none', borderRadius: 7, color: ACCENT.blue, fontWeight: 600, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>Dispense</button>
                                            )}
                                            <button onClick={() => handleDelete(rx.id)} style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(239,68,68,0.08)', border: 'none', cursor: 'pointer', color: ACCENT.red, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={13} /></button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* ── Add Prescription Modal ── */}
            {showAdd && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                    <div style={{ background: t.card, borderRadius: 20, width: '100%', maxWidth: 500, maxHeight: '90vh', overflow: 'auto', border: `1px solid ${t.border}`, boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>
                        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h2 style={{ fontWeight: 700, fontSize: 17 }}>Add Prescription</h2>
                                <p style={{ fontSize: 12, color: t.textSub, marginTop: 2 }}>Issue a new prescription for a patient</p>
                            </div>
                            <button onClick={() => setShowAdd(false)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, cursor: 'pointer', color: '#ef4444', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><X size={16} /></button>
                        </div>
                        <form onSubmit={handleAdd} style={{ padding: '24px' }}>
                            {formError && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', color: '#ef4444', fontSize: 13, marginBottom: 16 }}>{formError}</div>}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div style={{ gridColumn: '1/-1' }}>
                                    <label style={labelStyle}>Patient Name *</label>
                                    <input required style={inputStyle} value={form.patientName} onChange={e => setForm({ ...form, patientName: e.target.value })} placeholder="Patient name" />
                                </div>
                                <div style={{ gridColumn: '1/-1' }}>
                                    <label style={labelStyle}>Prescribing Doctor *</label>
                                    <select required style={inputStyle} value={form.doctor} onChange={e => setForm({ ...form, doctor: e.target.value })}>
                                        <option value="">Select doctor</option>
                                        {doctors.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                                    </select>
                                </div>
                                <div style={{ gridColumn: '1/-1' }}>
                                    <label style={labelStyle}>Drug Name & Strength *</label>
                                    <input required style={inputStyle} value={form.drug} onChange={e => setForm({ ...form, drug: e.target.value })} placeholder="e.g. Amoxicillin 500mg" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Dosage Instructions *</label>
                                    <input required style={inputStyle} value={form.dosage} onChange={e => setForm({ ...form, dosage: e.target.value })} placeholder="e.g. 1 tablet 3x daily" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Duration</label>
                                    <input style={inputStyle} value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 7 days" />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                                <button type="button" onClick={() => setShowAdd(false)} style={{ flex: 1, padding: '11px', background: t.input, border: `1px solid ${t.border}`, borderRadius: 10, color: t.textSub, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>Cancel</button>
                                <button type="submit" style={{ flex: 2, padding: '11px', background: `linear-gradient(135deg, ${BLUE}, ${BLUE2})`, border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>Issue Prescription</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}