import apiClient from "./client";

interface AppointmentPayload {
  customer_id: string | undefined;
  service_id: string;
  start_time: string;
  end_time: string;
}

export const appointmentsApi = {
  getAll: () =>
    apiClient.get("/appointment"),

  getByCustomer: (customerId: string) =>
    apiClient.get(`/appointment/customer/${customerId}`),

  create: (data: AppointmentPayload) =>
    apiClient.post("/appointment", data),

  update: (id: string, data: Partial<AppointmentPayload>) =>
    apiClient.patch(`/appointment/${id}`, data),

  updateStatus: (id: string, status: string) =>
    apiClient.patch(`/appointment/${id}`, { status }),

  delete: (id: string) =>
    apiClient.delete(`/appointment/${id}`),
};