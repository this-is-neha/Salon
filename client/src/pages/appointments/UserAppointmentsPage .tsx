import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../../common/header";
import { useAppointments } from "../../hooks";
import { AlertBanner } from "../../common/AlertBanner";
import { StatusBadge } from "../../common/StatusBadge";
import { AppointmentModal } from "../../common/AppointmentModal";
import type { Appointment, AppointmentFormData } from "../../types";

const DEFAULT_FORM: AppointmentFormData = {
  service_id: "",
  selected_date: new Date().toISOString().split("T")[0],
  selected_slot: "",
};

export default function UserAppointmentsPage() {
  const { customerId } = useParams<{ customerId: string }>();
  const location = useLocation();

  const {
    appointments, services, loading, message, showAlert,
    fetchData, bookAppointment, rescheduleAppointment,
    deleteAppointment, isSlotBooked,
  } = useAppointments({ customerId });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AppointmentFormData>(DEFAULT_FORM);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Pre-select service from router state (coming from /services page)
  useEffect(() => {
    const preselected = location.state?.preselectedServiceId;
    if (preselected) {
      setEditingId(null);
      setFormData({ ...DEFAULT_FORM, service_id: preselected });
      setIsModalOpen(true);
    }
  }, [location.state]);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({ ...DEFAULT_FORM, service_id: services.filter((s) => s.is_active)[0]?.id || "" });
    setIsModalOpen(true);
  };

  const openEditModal = (appt: Appointment) => {
    setEditingId(appt.id);
    const d = new Date(appt.start_time);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const slot = `${hh}:${mm}`;
    setFormData({
      service_id: appt.service_id,
      selected_date: d.toLocaleDateString("en-CA"),
      selected_slot: ["09:00", "11:30", "14:00", "16:30", "19:00"].includes(slot) ? slot : "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.service_id || !formData.selected_date || !formData.selected_slot) {
      showAlert("Please pick a service and time slot.", "error");
      return;
    }
    try {
      if (editingId) {
        await rescheduleAppointment(editingId, formData);
      } else {
        await bookAppointment(formData);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showAlert(err.response?.data?.message || "Failed to save appointment.", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try { await deleteAppointment(id); }
    catch { showAlert("Failed to delete appointment.", "error"); }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 mb-8 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Salon Appointments</h1>
            <p className="text-sm text-slate-500 mt-1">Manage your scheduled treatments.</p>
          </div>
          <button
            onClick={openCreateModal}
            className="mt-4 sm:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all"
          >
            + Schedule New Appointment
          </button>
        </div>

        <AlertBanner message={message} />

        {loading ? (
          <div className="text-center py-20 font-bold text-indigo-600 animate-pulse">Loading...</div>
        ) : appointments.length === 0 ? (
          <div className="text-center bg-white border border-dashed border-slate-300 rounded-2xl py-16 px-4 shadow-sm">
            <p className="text-slate-500 font-medium">No appointments scheduled yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Treatment</th>
                  <th className="px-6 py-4">Start</th>
                  <th className="px-6 py-4">End</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                {appointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{appt.service_name || "Salon Treatment"}</td>
                    <td className="px-6 py-4 font-mono text-xs">{new Date(appt.start_time).toLocaleString()}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-600">{new Date(appt.end_time).toLocaleString()}</td>
                    <td className="px-6 py-4"><StatusBadge status={appt.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {appt.status !== "completed" && appt.status !== "cancelled" && (
                          <button
                            onClick={() => openEditModal(appt)}
                            className="text-xs text-indigo-600 font-bold border border-indigo-200 rounded-lg px-3 py-1.5 hover:bg-indigo-600 hover:text-white transition-all"
                          >
                            Reschedule
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(appt.id)}
                          className="text-xs text-red-600 font-bold border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-600 hover:text-white transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AppointmentModal
        isOpen={isModalOpen}
        isEditing={!!editingId}
        formData={formData}
        services={services}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        onFormChange={(updates) => setFormData((prev) => ({ ...prev, ...updates }))}
        isSlotBooked={(date, time) => isSlotBooked(date, time, editingId)}
      />
    </div>
  );
}