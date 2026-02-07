import React, { useState } from 'react';
import { FileText, Calendar, User, Download, Eye, Activity, Heart, Thermometer } from 'lucide-react';

export default function Records() {
  const [records] = useState([
    {
      id: 1,
      type: "Lab Results",
      title: "Complete Blood Count (CBC)",
      date: "2024-02-05",
      doctor: "Dr. Sarah Johnson",
      department: "Laboratory",
      status: "Completed",
      results: {
        "WBC": "7.5 x10^9/L (Normal)",
        "RBC": "4.8 x10^12/L (Normal)",
        "Hemoglobin": "14.2 g/dL (Normal)",
        "Platelets": "250 x10^9/L (Normal)"
      },
      notes: "All values within normal range. Continue current treatment."
    },
    {
      id: 2,
      type: "Consultation",
      title: "Annual Physical Examination",
      date: "2024-01-28",
      doctor: "Dr. Michael Chen",
      department: "General Medicine",
      status: "Completed",
      vitals: {
        "Blood Pressure": "120/80 mmHg",
        "Heart Rate": "72 bpm",
        "Temperature": "98.6°F",
        "Weight": "70 kg"
      },
      diagnosis: "Patient in good health. No significant findings.",
      notes: "Continue healthy lifestyle. Follow-up in 1 year."
    },
    {
      id: 3,
      type: "Imaging",
      title: "Chest X-Ray",
      date: "2024-01-15",
      doctor: "Dr. Emily Rodriguez",
      department: "Radiology",
      status: "Completed",
      findings: "Clear lung fields. No abnormalities detected.",
      notes: "Normal chest x-ray. No follow-up required."
    },
    {
      id: 4,
      type: "Lab Results",
      title: "Lipid Panel",
      date: "2023-12-10",
      doctor: "Dr. Michael Chen",
      department: "Laboratory",
      status: "Completed",
      results: {
        "Total Cholesterol": "185 mg/dL (Normal)",
        "LDL": "110 mg/dL (Normal)",
        "HDL": "55 mg/dL (Normal)",
        "Triglycerides": "100 mg/dL (Normal)"
      },
      notes: "Cholesterol levels within healthy range. Maintain current diet and exercise."
    }
  ]);

  const getTypeColor = (type) => {
    switch (type) {
      case "Lab Results":
        return "bg-blue-100 text-blue-700";
      case "Consultation":
        return "bg-green-100 text-green-700";
      case "Imaging":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Lab Results":
        return <Activity className="w-5 h-5" />;
      case "Consultation":
        return <Heart className="w-5 h-5" />;
      case "Imaging":
        return <Eye className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Medical Records</h1>
          <p className="text-slate-600">View your complete medical history and test results</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">
                  {records.filter(r => r.type === "Lab Results").length}
                </p>
                <p className="text-sm text-slate-600">Lab Results</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">
                  {records.filter(r => r.type === "Consultation").length}
                </p>
                <p className="text-sm text-slate-600">Consultations</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">
                  {records.filter(r => r.type === "Imaging").length}
                </p>
                <p className="text-sm text-slate-600">Imaging</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{records.length}</p>
                <p className="text-sm text-slate-600">Total Records</p>
              </div>
            </div>
          </div>
        </div>

        {/* Records List */}
        <div className="space-y-4">
          {records.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    record.type === "Lab Results" ? "bg-blue-100" :
                    record.type === "Consultation" ? "bg-green-100" :
                    record.type === "Imaging" ? "bg-purple-100" : "bg-slate-100"
                  }`}>
                    {getTypeIcon(record.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-800">
                        {record.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(record.type)}`}>
                        {record.type}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{record.doctor}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(record.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>{record.department}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                  {record.status}
                </span>
              </div>

              {/* Lab Results */}
              {record.results && (
                <div className="bg-slate-50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-slate-700 mb-3">Test Results:</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {Object.entries(record.results).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">{key}:</span>
                        <span className="text-sm font-semibold text-slate-800">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vitals */}
              {record.vitals && (
                <div className="bg-slate-50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-slate-700 mb-3">Vital Signs:</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {Object.entries(record.vitals).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">{key}:</span>
                        <span className="text-sm font-semibold text-slate-800">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Diagnosis */}
              {record.diagnosis && (
                <div className="bg-slate-50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-slate-700 mb-1">Diagnosis:</p>
                  <p className="text-sm text-slate-600">{record.diagnosis}</p>
                </div>
              )}

              {/* Findings */}
              {record.findings && (
                <div className="bg-slate-50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-slate-700 mb-1">Findings:</p>
                  <p className="text-sm text-slate-600">{record.findings}</p>
                </div>
              )}

              {/* Notes */}
              {record.notes && (
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-blue-700 mb-1">Doctor's Notes:</p>
                  <p className="text-sm text-blue-600">{record.notes}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 text-sm font-semibold">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition flex items-center gap-2 text-sm font-semibold">
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {records.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Medical Records</h3>
            <p className="text-slate-600">You don't have any medical records yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}