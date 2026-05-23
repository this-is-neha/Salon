import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../common/header"; 
import { useAuth, useServices } from "../../hooks";
import { AlertBanner } from "../../common/AlertBanner";
import type { SalonService, ServiceFormData } from "../../types";

const EMPTY_FORM: ServiceFormData = { name: "", description: "", price: "", duration_minutes: 30 };

export default function ServicesPage() {
  const navigate = useNavigate();
  const { isAdmin, userId } = useAuth();
  const { services, loading, message, showAlert, createService, updateService, deleteService } = useServices();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>(EMPTY_FORM);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEditModal = (svc: SalonService) => {
    setEditingId(svc.id);
    setFormData({
      name: svc.name,
      description: svc.description || "",
      price: svc.price.toString(),
      duration_minutes: svc.duration_minutes,
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.duration_minutes) {
      showAlert("Please fill in all required fields.", "error");
      return;
    }
    try {
      if (editingId) {
        await updateService(editingId, formData);
      } else {
        await createService(formData);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showAlert(err.response?.data?.message || "Failed to save service.", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this service permanently?")) return;
    try {
      await deleteService(id);
    } catch {
      showAlert("Failed to delete service.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 mb-8 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {isAdmin ? "Salon Services Control Panel" : "Our Treatment Catalog"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {isAdmin
                ? "Configure and manage service availability."
                : "Browse treatments and book your reservation."}
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={openCreateModal}
              className="mt-4 sm:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all"
            >
              + Add New Service
            </button>
          )}
        </div>

        <AlertBanner message={message} />

        {loading ? (
          <div className="text-center py-20 font-bold text-indigo-600 animate-pulse">
            Loading services...
          </div>
        ) : services.length === 0 ? (
          <div className="text-center bg-white border border-dashed border-slate-300 rounded-2xl py-16 px-4 shadow-sm">
            <p className="text-slate-500 font-medium">No services configured yet.</p>
            {isAdmin && (
              <button onClick={openCreateModal} className="mt-3 text-sm font-bold text-indigo-600 underline">
                Add your first service
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Service Name</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                {services.map((svc) => (
                  <tr
                    key={svc.id}
                    className={!svc.is_active ? "bg-slate-50/70 text-slate-400" : "hover:bg-slate-50/40 transition-colors"}
                  >
                    <td className={`px-6 py-4 font-bold ${svc.is_active ? "text-slate-900" : "text-slate-400"}`}>
                      {svc.name}
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate">{svc.description || "—"}</td>
                    <td className="px-6 py-4 font-mono font-semibold text-slate-600">{svc.duration_minutes} Mins</td>
                    <td className={`px-6 py-4 font-black ${svc.is_active ? "text-slate-900" : "text-slate-400"}`}>
                      ${Number(svc.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      {isAdmin ? (
                        <select
                          value={svc.is_active ? "true" : "false"}
                          onChange={(e) => updateService(svc.id, { is_active: e.target.value === "true" })}
                          className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm ${
                            svc.is_active
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          <option value="true"> Active</option>
                          <option value="false"> Inactive</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          svc.is_active ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
                        }`}>
                          {svc.is_active ? "Active" : "Inactive"}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isAdmin ? (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openEditModal(svc)}
                            className="text-xs text-indigo-600 font-bold border border-indigo-200 rounded-lg px-3 py-1.5 hover:bg-indigo-600 hover:text-white transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(svc.id)}
                            className="text-xs text-red-600 font-bold border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-600 hover:text-white transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => navigate(`/appointment/${svc.id}/${userId}`)}
                          className="text-xs bg-indigo-600 text-white font-bold rounded-lg px-4 py-2 shadow-sm hover:bg-indigo-700 transition-colors"
                        >
                          Book Appointment
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

  
      {isModalOpen && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
              <h2 className="text-xl font-extrabold text-slate-900">
                {editingId ? "Modify Treatment Details" : "Configure New Treatment"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Service Name *</label>
                <input
                  type="text" name="name" value={formData.name} onChange={handleInputChange}
                  placeholder="e.g., Deep Tissue Massage"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  name="description" value={formData.description} onChange={handleInputChange} rows={3}
                  placeholder="Describe the treatment benefits..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Price (USD) *</label>
                  <input
                    type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange}
                    placeholder="85.00"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Duration (Mins) *</label>
                  <input
                    type="number" name="duration_minutes" value={formData.duration_minutes} onChange={handleInputChange}
                    placeholder="60" min="5"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div className="pt-5 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-md"
                >
                  {editingId ? "Update Changes" : "Save Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}