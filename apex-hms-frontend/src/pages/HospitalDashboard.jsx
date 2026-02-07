import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  UserPlus, 
  Activity,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Pill,
  FileText,
  BarChart3,
  Plus
} from 'lucide-react';

export default function HospitalDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hospital, setHospital] = useState(null);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalStaff: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    activePrescriptions: 0,
    recentRecords: 0
  });
  const [recentPatients, setRecentPatients] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useEffect(() => {
    // Get hospital data from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || !userData.id) {
      navigate('/hospital/auth');
      return;
    }
    
    setHospital(userData);
    fetchDashboardData(userData.id);
  }, [navigate]);

  const fetchDashboardData = async (hospitalId) => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch patients count
      const patientsResponse = await fetch(`http://localhost:5000/api/patients/hospital/${hospitalId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (patientsResponse.ok) {
        const patientsData = await patientsResponse.json();
        setStats(prev => ({ ...prev, totalPatients: patientsData.patients.length }));
        // Get recent 5 patients
        setRecentPatients(patientsData.patients.slice(0, 5));
      }

      // TODO: Fetch staff, appointments, prescriptions when those endpoints are ready
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Welcome back, {hospital?.name || 'Hospital Admin'}! 👋
          </h1>
          <p className="text-slate-600">Here's what's happening with your hospital today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Users className="w-6 h-6" />}
            label="Total Patients"
            value={stats.totalPatients}
            change="+12%"
            changeType="positive"
            color="blue"
          />
          <StatCard
            icon={<Calendar className="w-6 h-6" />}
            label="Today's Appointments"
            value={stats.todayAppointments}
            change="8 pending"
            color="green"
          />
          <StatCard
            icon={<UserPlus className="w-6 h-6" />}
            label="Staff Members"
            value={stats.totalStaff}
            color="purple"
          />
          <StatCard
            icon={<Activity className="w-6 h-6" />}
            label="Active Prescriptions"
            value={stats.activePrescriptions}
            color="orange"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <QuickActionCard
            icon={<UserPlus />}
            title="Register Patient"
            description="Add new patient"
            onClick={() => navigate('/dashboard/patients?action=add')}
            color="blue"
          />
          <QuickActionCard
            icon={<Calendar />}
            title="Book Appointment"
            description="Schedule appointment"
            onClick={() => navigate('/dashboard/appointments?action=book')}
            color="green"
          />
          <QuickActionCard
            icon={<Pill />}
            title="Add Prescription"
            description="Create prescription"
            onClick={() => navigate('/dashboard/pharmacy?action=add')}
            color="purple"
          />
          <QuickActionCard
            icon={<FileText />}
            title="Medical Record"
            description="Add new record"
            onClick={() => navigate('/dashboard/patients')}
            color="orange"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Patients */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Recent Patients</h3>
              <button
                onClick={() => navigate('/dashboard/patients')}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                View All →
              </button>
            </div>
            
            {recentPatients.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 mb-4">No patients registered yet</p>
                <button
                  onClick={() => navigate('/dashboard/patients?action=add')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-semibold"
                >
                  Register First Patient
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                    onClick={() => navigate(`/dashboard/patients/${patient.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                        {patient.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{patient.full_name}</p>
                        <p className="text-sm text-slate-600">{patient.patient_number}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">{patient.blood_group || 'N/A'}</p>
                      <p className="text-xs text-slate-500">{patient.gender}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Today's Appointments</h3>
              <button
                onClick={() => navigate('/dashboard/appointments')}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                View All →
              </button>
            </div>
            
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 mb-4">No appointments scheduled for today</p>
              <button
                onClick={() => navigate('/dashboard/appointments?action=book')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-semibold"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            <ActivityItem
              icon={<UserPlus className="w-5 h-5" />}
              title="New patient registered"
              description="John Doe was added to the system"
              time="2 hours ago"
              color="blue"
            />
            <ActivityItem
              icon={<Calendar className="w-5 h-5" />}
              title="Appointment completed"
              description="Dr. Smith completed consultation with Jane Smith"
              time="5 hours ago"
              color="green"
            />
            <ActivityItem
              icon={<FileText className="w-5 h-5" />}
              title="Medical record updated"
              description="Lab results added for Patient #P000123"
              time="1 day ago"
              color="purple"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, change, changeType, color }) {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${colors[color]} flex items-center justify-center`}>
          {icon}
        </div>
        {change && (
          <span className={`text-sm font-semibold ${changeType === 'positive' ? 'text-green-600' : 'text-slate-600'}`}>
            {change}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-slate-800 mb-1">{value}</p>
      <p className="text-sm text-slate-600">{label}</p>
    </div>
  );
}

// Quick Action Card Component
function QuickActionCard({ icon, title, description, onClick, color }) {
  const colors = {
    blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
    purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
  };

  return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-br ${colors[color]} text-white rounded-xl p-6 text-left hover:shadow-lg transition group`}
    >
      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
        {React.cloneElement(icon, { className: "w-6 h-6" })}
      </div>
      <h4 className="font-bold text-lg mb-1">{title}</h4>
      <p className="text-sm text-white/80">{description}</p>
    </button>
  );
}

// Activity Item Component
function ActivityItem({ icon, title, description, time, color }) {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
      <div className={`w-10 h-10 rounded-lg ${colors[color]} flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-slate-800">{title}</p>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
      <span className="text-xs text-slate-500 whitespace-nowrap">{time}</span>
    </div>
  );
}