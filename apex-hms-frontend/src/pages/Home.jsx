import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    CalendarDays,
    Users,
    FileText,
    ShieldCheck,
    Activity,
    Stethoscope,
    Clock,
    Heart,
    Award,
    Phone,
    MapPin,
    Mail,
    ChevronRight,
    CheckCircle2,
    Zap,
    Lock,
    MessageSquare,
    Building2,
    ClipboardList,
    Pill,
    UserCog,
    TrendingUp,
    Star,
    ArrowRight,
    Database,
    Globe,
    Smartphone,
    BarChart3,
    Shield,
    HeartPulse,
    UserPlus,
    FileCheck,
    BellRing,
    Blocks,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        patients: 0,
        hospitals: 0,
        doctors: 0,
        uptime: 0,
        rating: 0
    });

    // Animate counters
    useEffect(() => {
        const target = { 
            patients: 50000, 
            hospitals: 250,
            doctors: 1500, 
            uptime: 99.9, 
            rating: 4.9 
        };
        const duration = 2000;
        const start = performance.now();

        const animate = (time) => {
            const progress = Math.min((time - start) / duration, 1);
            setStats({
                patients: Math.floor(progress * target.patients),
                hospitals: Math.floor(progress * target.hospitals),
                doctors: Math.floor(progress * target.doctors),
                uptime: (progress * target.uptime).toFixed(1),
                rating: (progress * target.rating).toFixed(1),
            });
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, []);

    return (
        <div className="bg-white text-slate-800">

            {/* ================= HERO SECTION ================= */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03]">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-8"
                    >
                        <Activity className="w-4 h-4" />
                        <span>Multi-Tenant Healthcare Platform</span>
                    </motion.div>

                    {/* Main Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl lg:text-7xl font-black mb-6 leading-tight"
                    >
                        Centralized Hospital<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                            Management Platform
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed"
                    >
                        A unified platform where hospitals register, manage patients, schedule appointments, 
                        and store medical records. Each hospital operates independently with complete data isolation.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap justify-center gap-4 mb-12"
                    >
                        <button
                            onClick={() => navigate("/hospital/register")}
                            className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center gap-2"
                        >
                            Register Your Hospital
                            <ChevronRight className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => navigate("/hospital/login")}
                            className="px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-xl font-bold hover:border-indigo-600 hover:text-indigo-600 transition"
                        >
                            Hospital Login
                        </button>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-wrap justify-center gap-8 text-sm text-slate-600"
                    >
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <span>Instant Setup</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <span>Super Admin Approval</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <span>HIPAA Compliant</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <span>Data Isolation</span>
                        </div>
                    </motion.div>

                    {/* Floating Stats Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-16 max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border border-slate-100"
                    >
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                                <span className="text-sm font-semibold text-slate-700">Platform Statistics</span>
                            </div>
                            <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                                Live
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                            <StatBox label="Registered Hospitals" value={`${stats.hospitals}+`} />
                            <StatBox label="Total Patients" value={`${stats.patients.toLocaleString()}+`} />
                            <StatBox label="Healthcare Providers" value={`${stats.doctors.toLocaleString()}+`} />
                            <StatBox label="System Uptime" value={`${stats.uptime}%`} />
                            <StatBox label="Average Rating" value={`${stats.rating}/5`} />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ================= HOW IT WORKS ================= */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <p className="text-indigo-600 font-semibold mb-2">How It Works</p>
                        <h2 className="text-4xl lg:text-5xl font-black mb-4">
                            Simple 4-step onboarding process
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Register your hospital and start managing patient records in minutes.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                        <StepCard
                            step="01"
                            icon={<Building2 />}
                            title="Register Your Hospital"
                            desc="Fill out the hospital registration form with your facility details and administrator information."
                        />
                        <StepCard
                            step="02"
                            icon={<ShieldCheck />}
                            title="Super Admin Approval"
                            desc="Our team reviews your application and approves your hospital within 24 hours."
                        />
                        <StepCard
                            step="03"
                            icon={<UserPlus />}
                            title="Setup Your Dashboard"
                            desc="Login to your hospital dashboard, add staff members, and configure departments."
                        />
                        <StepCard
                            step="04"
                            icon={<Activity />}
                            title="Start Managing Patients"
                            desc="Register patients, schedule appointments, and maintain complete medical records."
                        />
                    </div>

                    {/* Visual Flow Diagram */}
                    <div className="relative max-w-4xl mx-auto">
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-200 via-indigo-400 to-indigo-200 -translate-y-1/2 hidden lg:block"></div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                            <FlowCard
                                title="Public Platform"
                                items={["Hospital Registration", "Hospital Login", "Super Admin Login"]}
                                color="blue"
                            />
                            <FlowCard
                                title="Super Admin Panel"
                                items={["Approve Hospitals", "Monitor Activities", "Manage Platform"]}
                                color="purple"
                            />
                            <FlowCard
                                title="Hospital Dashboard"
                                items={["Patient Management", "Staff & Appointments", "Medical Records"]}
                                color="green"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= FEATURES SECTION ================= */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl lg:text-5xl font-black mb-4"
                        >
                            Everything your hospital needs
                        </motion.h2>
                        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                            Complete hospital management system with patient records, appointments, staff management, and medical records in one unified platform.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Users />}
                            title="Patient Registration"
                            desc="Register and manage unlimited patients with complete demographic and medical information."
                            color="blue"
                        />
                        <FeatureCard
                            icon={<CalendarDays />}
                            title="Appointment Scheduling"
                            desc="Book appointments with doctors, manage schedules, and send automated reminders."
                            color="indigo"
                        />
                        <FeatureCard
                            icon={<FileText />}
                            title="Medical Records"
                            desc="Store diagnoses, test results, prescriptions, and complete patient medical history securely."
                            color="purple"
                        />
                        <FeatureCard
                            icon={<UserCog />}
                            title="Staff Management"
                            desc="Add doctors, nurses, pharmacists, and lab staff with role-based access control."
                            color="green"
                        />
                        <FeatureCard
                            icon={<Database />}
                            title="Data Isolation"
                            desc="Complete data separation between hospitals. Your patient data is yours alone."
                            color="red"
                        />
                        <FeatureCard
                            icon={<ShieldCheck />}
                            title="HIPAA Compliant"
                            desc="Enterprise-grade security with encryption, audit logs, and compliance monitoring."
                            color="orange"
                        />
                        <FeatureCard
                            icon={<BarChart3 />}
                            title="Analytics & Reports"
                            desc="Real-time dashboards showing patient statistics, appointment trends, and operational insights."
                            color="cyan"
                        />
                        <FeatureCard
                            icon={<Pill />}
                            title="Pharmacy Integration"
                            desc="Manage prescriptions, track medication dispensing, and monitor pharmacy inventory."
                            color="pink"
                        />
                        <FeatureCard
                            icon={<Blocks />}
                            title="Multi-Department Support"
                            desc="Organize your hospital by departments with specialized workflows for each unit."
                            color="teal"
                        />
                    </div>
                </div>
            </section>

            {/* ================= USER ROLES SECTION ================= */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <p className="text-indigo-600 font-semibold mb-2">User Roles</p>
                        <h2 className="text-4xl lg:text-5xl font-black mb-4">
                            Role-based access for everyone
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Different access levels for different users, ensuring data security and operational efficiency.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <RoleCard
                            icon={<Shield />}
                            title="Super Admin"
                            permissions={[
                                "Approve hospital registrations",
                                "Monitor all platform activity",
                                "Suspend/delete hospitals",
                                "Manage system settings"
                            ]}
                            color="red"
                        />
                        <RoleCard
                            icon={<Building2 />}
                            title="Hospital Admin"
                            permissions={[
                                "Manage hospital profile",
                                "Add/remove staff members",
                                "Register patients",
                                "Full hospital access"
                            ]}
                            color="blue"
                        />
                        <RoleCard
                            icon={<Stethoscope />}
                            title="Doctors & Staff"
                            permissions={[
                                "View assigned patients",
                                "Add medical records",
                                "Manage appointments",
                                "Update prescriptions"
                            ]}
                            color="green"
                        />
                        <RoleCard
                            icon={<Heart />}
                            title="Patients"
                            permissions={[
                                "Registered by hospital",
                                "Access medical records",
                                "View appointment history",
                                "Secure patient portal"
                            ]}
                            color="pink"
                        />
                    </div>
                </div>
            </section>

            {/* ================= SECURITY SECTION ================= */}
            <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="inline-flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                                <Lock className="w-4 h-4" />
                                <span>Enterprise Security</span>
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-black mb-4">
                                Your data is our priority
                            </h2>
                            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                                Bank-level security with complete data isolation between hospitals.
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <SecurityFeature
                            icon={<Lock />}
                            title="End-to-End Encryption"
                            desc="All data encrypted in transit and at rest"
                        />
                        <SecurityFeature
                            icon={<Database />}
                            title="Data Isolation"
                            desc="Complete separation of hospital databases"
                        />
                        <SecurityFeature
                            icon={<ShieldCheck />}
                            title="HIPAA Compliant"
                            desc="Meets all healthcare data regulations"
                        />
                        <SecurityFeature
                            icon={<FileCheck />}
                            title="Audit Trails"
                            desc="Complete logging of all system activities"
                        />
                        <SecurityFeature
                            icon={<Users />}
                            title="Role-Based Access"
                            desc="Granular permissions for each user type"
                        />
                        <SecurityFeature
                            icon={<Activity />}
                            title="24/7 Monitoring"
                            desc="Real-time security threat detection"
                        />
                        <SecurityFeature
                            icon={<Globe />}
                            title="Automated Backups"
                            desc="Daily backups with 99.9% uptime SLA"
                        />
                        <SecurityFeature
                            icon={<BellRing />}
                            title="Instant Alerts"
                            desc="Security notifications for suspicious activity"
                        />
                    </div>
                </div>
            </section>

            {/* ================= TESTIMONIALS ================= */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <p className="text-indigo-600 font-semibold mb-2">Testimonials</p>
                        <h2 className="text-4xl lg:text-5xl font-black mb-4">
                            Trusted by hospitals worldwide
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Join hundreds of healthcare facilities managing their operations on our platform.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <TestimonialCard
                            quote="This platform transformed how we manage our multi-location hospital network. Patient data is centralized yet completely secure. Registration was instant and the approval process was seamless."
                            initials="DR"
                            name="Dr. Rachel Martinez"
                            title="Chief Medical Officer"
                            company="MediCare General Hospital Network"
                        />
                        <TestimonialCard
                            quote="The role-based access system is perfect. Our doctors, nurses, and admin staff each have exactly the permissions they need. Data isolation gives us complete peace of mind."
                            initials="JS"
                            name="James Sullivan"
                            title="Hospital Administrator"
                            company="St. Mary's Medical Center"
                        />
                        <TestimonialCard
                            quote="We registered 3 of our hospitals on this platform. The centralized management while maintaining complete data separation is exactly what we needed. Highly recommended!"
                            initials="AK"
                            name="Dr. Aisha Kamara"
                            title="Director of Operations"
                            company="HealthFirst Clinic Network"
                        />
                    </div>
                </div>
            </section>

            {/* ================= CTA SECTION ================= */}
            <section className="py-24 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white">
                <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl lg:text-5xl font-black mb-6">
                            Ready to register your hospital?
                        </h2>
                        <p className="text-xl text-indigo-100 mb-10 max-w-3xl mx-auto">
                            Join the growing network of hospitals using our centralized management platform. 
                            Get approved and start managing patients within 24 hours.
                        </p>

                        <div className="flex flex-wrap justify-center gap-6 mb-12">
                            <div className="flex items-center gap-2 text-indigo-100">
                                <CheckCircle2 className="w-5 h-5" />
                                <span>Quick registration</span>
                            </div>
                            <div className="flex items-center gap-2 text-indigo-100">
                                <CheckCircle2 className="w-5 h-5" />
                                <span>24-hour approval</span>
                            </div>
                            <div className="flex items-center gap-2 text-indigo-100">
                                <CheckCircle2 className="w-5 h-5" />
                                <span>Unlimited patients</span>
                            </div>
                            <div className="flex items-center gap-2 text-indigo-100">
                                <CheckCircle2 className="w-5 h-5" />
                                <span>Free migration support</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4">
                            <button
                                onClick={() => navigate("/hospital/register")}
                                className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition shadow-lg flex items-center gap-2"
                            >
                                Register Your Hospital
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => navigate("/hospital/login")}
                                className="px-8 py-4 border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition"
                            >
                                Hospital Login
                            </button>
                        </div>

                        {/* Super Admin Login Link */}
                        <div className="mt-8 pt-8 border-t border-indigo-500/30">
                            <button
                                onClick={() => navigate("/admin/login")}
                                className="text-indigo-200 hover:text-white text-sm font-medium transition"
                            >
                                Super Admin Access →
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ================= CONTACT/INFO SECTION ================= */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-3xl mx-auto px-6 lg:px-8">
                    <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 border border-slate-100">
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-bold mb-3">Need more information?</h3>
                            <p className="text-slate-600">
                                Contact our team to learn more about the platform and registration process.
                            </p>
                        </div>

                        <form className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Hospital Name"
                                    className="px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Administrator Name"
                                    className="px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <select className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-600">
                                <option>Hospital Type</option>
                                <option>General Hospital</option>
                                <option>Specialty Hospital</option>
                                <option>Private Clinic</option>
                                <option>Medical Center</option>
                                <option>Multi-Location Network</option>
                            </select>
                            <textarea
                                placeholder="Message or Questions"
                                rows="4"
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            ></textarea>
                            <button
                                type="submit"
                                className="w-full px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition"
                            >
                                Send Message
                            </button>
                            <p className="text-xs text-slate-500 text-center">
                                By submitting, you agree to our Privacy Policy and Terms of Service.
                            </p>
                        </form>
                    </div>
                </div>
            </section>

        </div>
    );
}

/* ================= COMPONENTS ================= */
function StatBox({ label, value }) {
    return (
        <div className="text-center">
            <p className="text-3xl font-black text-slate-800 mb-1">{value}</p>
            <p className="text-sm text-slate-600">{label}</p>
        </div>
    );
}

function FeatureCard({ icon, title, desc, color = "indigo" }) {
    const colorClasses = {
        blue: "bg-blue-100 text-blue-600 group-hover:bg-blue-600",
        indigo: "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600",
        purple: "bg-purple-100 text-purple-600 group-hover:bg-purple-600",
        green: "bg-green-100 text-green-600 group-hover:bg-green-600",
        red: "bg-red-100 text-red-600 group-hover:bg-red-600",
        orange: "bg-orange-100 text-orange-600 group-hover:bg-orange-600",
        cyan: "bg-cyan-100 text-cyan-600 group-hover:bg-cyan-600",
        pink: "bg-pink-100 text-pink-600 group-hover:bg-pink-600",
        teal: "bg-teal-100 text-teal-600 group-hover:bg-teal-600",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 border border-slate-100 hover:border-indigo-200 hover:shadow-lg transition group"
        >
            <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-6 group-hover:text-white transition`}>
                {React.cloneElement(icon, { size: 24 })}
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-800">{title}</h3>
            <p className="text-slate-600 leading-relaxed">{desc}</p>
        </motion.div>
    );
}

function StepCard({ step, icon, title, desc }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative text-center"
        >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 font-black text-xl mb-4">
                {React.cloneElement(icon, { size: 28 })}
            </div>
            <div className="absolute top-0 right-0 bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                {step}
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-800">{title}</h3>
            <p className="text-slate-600 leading-relaxed">{desc}</p>
        </motion.div>
    );
}

function FlowCard({ title, items, color }) {
    const colorClasses = {
        blue: "from-blue-500 to-blue-600",
        purple: "from-purple-500 to-purple-600",
        green: "from-green-500 to-green-600",
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
        >
            <div className={`bg-gradient-to-br ${colorClasses[color]} text-white px-4 py-2 rounded-lg font-bold text-center mb-4`}>
                {title}
            </div>
            <ul className="space-y-2">
                {items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </motion.div>
    );
}

function RoleCard({ icon, title, permissions, color }) {
    const colorClasses = {
        red: "bg-red-100 text-red-600",
        blue: "bg-blue-100 text-blue-600",
        green: "bg-green-100 text-green-600",
        pink: "bg-pink-100 text-pink-600",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition"
        >
            <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-4`}>
                {React.cloneElement(icon, { size: 24 })}
            </div>
            <h3 className="text-xl font-bold mb-4 text-slate-800">{title}</h3>
            <ul className="space-y-2">
                {permissions.map((perm, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{perm}</span>
                    </li>
                ))}
            </ul>
        </motion.div>
    );
}

function SecurityFeature({ icon, title, desc }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-indigo-500 transition"
        >
            <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center mb-4">
                {React.cloneElement(icon, { size: 20 })}
            </div>
            <h4 className="font-bold mb-2">{title}</h4>
            <p className="text-sm text-slate-400">{desc}</p>
        </motion.div>
    );
}

function TestimonialCard({ quote, initials, name, title, company }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-50 rounded-2xl p-8 border border-slate-100"
        >
            <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
            </div>
            <p className="text-slate-700 mb-6 leading-relaxed italic">"{quote}"</p>
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                    {initials}
                </div>
                <div>
                    <p className="font-bold text-slate-800">{name}</p>
                    <p className="text-sm text-slate-600">{title}</p>
                    <p className="text-xs text-slate-500">{company}</p>
                </div>
            </div>
        </motion.div>
    );
}