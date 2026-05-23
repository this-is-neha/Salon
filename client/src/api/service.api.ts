import apiClient from "./client";
import type { ServiceFormData } from "../types";

export const servicesApi = {
  getAll: () =>
    apiClient.get("/services"),

  getById: (id: string) =>
    apiClient.get(`/services/${id}`),

  create: (data: ServiceFormData) =>
    apiClient.post("/services", data),

  update: (id: string, data: Partial<ServiceFormData> & { is_active?: boolean }) =>
    apiClient.patch(`/services/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/services/${id}`),
};