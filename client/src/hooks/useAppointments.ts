import { useState, useCallback } from "react";
import { appointmentsApi } from "../api/appointment.api";
import { servicesApi } from "../api/service.api";
import { useAlert } from "./useAlert";
import type { Appointment, AppointmentFormData, SalonService } from "../types";

interface UseAppointmentsOptions {
  customerId?: string;
  adminMode?: boolean;
}

export function useAppointments({ customerId, adminMode = false }: UseAppointmentsOptions = {}) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<SalonService[]>([]);
  const [loading, setLoading] = useState(true);
  const { message, showAlert } = useAlert();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [servicesRes, appointmentsRes] = await Promise.all([
        servicesApi.getAll(),
        adminMode
          ? appointmentsApi.getAll()
          : appointmentsApi.getByCustomer(customerId!),
      ]);
      setServices(servicesRes.data.result || []);
      setAppointments(appointmentsRes.data.result || []);
    } catch {
      showAlert("Failed to load appointments.", "error");
    } finally {
      setLoading(false);
    }
  }, [customerId, adminMode, showAlert]);

  const bookAppointment = async (formData: AppointmentFormData, currentCustomerId?: string) => {
    const service = services.find((s) => s.id === formData.service_id);
    if (!service) return;

    const startTime = new Date(`${formData.selected_date}T${formData.selected_slot}:00`);
    const endTime = new Date(startTime.getTime() + Number(service.duration_minutes) * 60000);

    await appointmentsApi.create({
      customer_id: currentCustomerId ?? customerId,
      service_id: formData.service_id,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
    });

    showAlert("Appointment booked successfully!", "success");
    await fetchData();
  };

  const rescheduleAppointment = async (
    appointmentId: string,
    formData: AppointmentFormData,
    currentCustomerId?: string
  ) => {
    const service = services.find((s) => s.id === formData.service_id);
    if (!service) return;

    const startTime = new Date(`${formData.selected_date}T${formData.selected_slot}:00`);
    const endTime = new Date(startTime.getTime() + Number(service.duration_minutes) * 60000);

    await appointmentsApi.update(appointmentId, {
      customer_id: currentCustomerId ?? customerId,
      service_id: formData.service_id,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
    });

    showAlert("Appointment rescheduled successfully.", "success");
    await fetchData();
  };

  const updateStatus = async (id: string, status: string) => {
    await appointmentsApi.updateStatus(id, status);
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: status as Appointment["status"] } : a))
    );
    showAlert(`Status updated to ${status}.`, "success");
  };

  const deleteAppointment = async (id: string) => {
    await appointmentsApi.delete(id);
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    showAlert("Appointment deleted.", "success");
  };

  const isSlotBooked = (dateStr: string, timeStr: string, excludeId?: string | null) => {
    const target = new Date(`${dateStr}T${timeStr}:00`).getTime();
    return appointments.some((appt) => {
      if (appt.status === "cancelled") return false;
      if (excludeId && appt.id === excludeId) return false;
      return new Date(appt.start_time).getTime() === target;
    });
  };

  return {
    appointments,
    services,
    loading,
    message,
    showAlert,
    fetchData,
    bookAppointment,
    rescheduleAppointment,
    updateStatus,
    deleteAppointment,
    isSlotBooked,
  };
}