import type { SalonService, AppointmentFormData } from "../types/index";
import { TimeSlotPicker } from "./TimeSlotPicker";

interface Props {
  isOpen: boolean;
  isEditing: boolean;
  formData: AppointmentFormData;
  services: SalonService[];
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onFormChange: (updates: Partial<AppointmentFormData>) => void;
  isSlotBooked: (date: string, time: string) => boolean;
}

export function AppointmentModal({
  isOpen, isEditing, formData, services,
  onClose, onSubmit, onFormChange, isSlotBooked,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
          <h2 className="text-xl font-extrabold text-slate-900">
            {isEditing ? "Reschedule Appointment" : "Book New Treatment"}
          </h2>
          <button onClick={onClose} className="text-slate-400 font-bold">✕</button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
              Select Treatment
            </label>
            <select
              value={formData.service_id}
              onChange={(e) => onFormChange({ service_id: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {services.filter((s) => s.is_active).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — ${s.price} ({s.duration_minutes} min)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
              Select Date
            </label>
            <input
              type="date"
              value={formData.selected_date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => onFormChange({ selected_date: e.target.value, selected_slot: "" })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <TimeSlotPicker
            selectedDate={formData.selected_date}
            selectedSlot={formData.selected_slot}
            isSlotBooked={isSlotBooked}
            onSelect={(slot) => onFormChange({ selected_slot: slot })}
          />

          <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100">
            <button
              type="button" onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Dismiss
            </button>
            <button
              type="submit"
              disabled={!formData.selected_slot}
              className={`px-5 py-2 text-white rounded-xl text-sm font-bold shadow-md transition-all ${
                formData.selected_slot ? "bg-indigo-600 hover:bg-indigo-700" : "bg-slate-300 cursor-not-allowed"
              }`}
            >
              {isEditing ? "Confirm Reschedule" : "Secure Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}