import { useState, useEffect, useCallback } from "react";
import { servicesApi } from "../api/service.api";
import { useAlert } from "./useAlert";
import type { SalonService, ServiceFormData } from "../types";

export function useServices() {
  const [services, setServices] = useState<SalonService[]>([]);
  const [loading, setLoading] = useState(true);
  const { message, showAlert } = useAlert();

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const res = await servicesApi.getAll();
      setServices(res.data.result || []);
    } catch {
      showAlert("Failed to load salon services.", "error");
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const createService = async (data: ServiceFormData) => {
    await servicesApi.create(data);
    showAlert("Service created successfully!", "success");
    await fetchServices();
  };

  const updateService = async (
    id: string,
    data: Partial<ServiceFormData> & { is_active?: boolean }
  ) => {
    await servicesApi.update(id, data);
    showAlert("Service updated successfully!", "success");
  
    if ("is_active" in data) {
      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...data } : s))
      );
    } else {
      await fetchServices();
    }
  };

  const deleteService = async (id: string) => {
    await servicesApi.delete(id);
    showAlert("Service deleted.", "success");
    await fetchServices();
  };

  return { services, loading, message, showAlert, createService, updateService, deleteService, fetchServices };
}