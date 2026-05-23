import apiClient from "./client";

export const bulkApi = {
  getTemplates: () =>
    apiClient.get("/notification/templates"),

  getLogs: () =>
    apiClient.get("/logs"),

  upload: (file: File, templateId: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("templateId", templateId);
    return apiClient.post("/bulk/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};