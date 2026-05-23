import { useEffect } from "react";
import Navbar from "../../common/header";
import { useAppointments } from "../../hooks/useAppointments";
import { AlertBanner } from "../../common/AlertBanner";
import type { AppointmentStatus } from "../../types";

const STATUS_OPTIONS: { value: AppointmentStatus; label: string }[] = [
  { value: "pending",   label: " Pending" },
  { value: "confirmed", label: " Confirmed" },
  { value: "completed", label: " Completed" },
  { value: "cancelled", label: " Cancelled" },
];

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  confirmed: "bg-green-50 text-green-700",
  cancelled:  "bg-red-50 text-red-700",
  completed:  "bg-blue-50 text-blue-700",
  pending:    "bg-amber-50 text-amber-700",
};

export default function AdminAppointmentsPage() {
  const { appointments, loading, message, showAlert, fetchData, updateStatus, deleteAppointment } =
    useAppointments({ adminMode: true });

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this appointment?")) return;
    try { await deleteAppointment(id); }
    catch { showAlert("Delete failed.", "error"); }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-6xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-black mb-6">Global Appointment Control Panel</h1>

        <AlertBanner message={message} />

        {loading ? (
          <p className="text-indigo-600 font-bold">Loading...</p>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">
            <table className="min-w-full divide-y">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Service</th>
                  <th className="px-6 py-3">Start</th>
                  <th className="px-6 py-3">End</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {appointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono text-xs">{appt.customer_name || appt.customer_id}</td>
                    <td className="px-6 py-4 font-semibold">{appt.service_name}</td>
                    <td className="px-6 py-4 text-xs">{new Date(appt.start_time).toLocaleString()}</td>
                    <td className="px-6 py-4 text-xs">{new Date(appt.end_time).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <select
                        value={appt.status}
                        onChange={(e) => updateStatus(appt.id, e.target.value)}
                        className={`text-xs font-bold px-2 py-1 rounded border ${STATUS_COLORS[appt.status]}`}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(appt.id)}
                        className="text-xs px-3 py-1 border border-red-200 text-red-600 rounded hover:bg-red-600 hover:text-white"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}