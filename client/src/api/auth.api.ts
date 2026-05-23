import apiClient from "./client";
import type { AuthFormData } from "../types";

export const authApi = {
  login: (data: Pick<AuthFormData, "email" | "password">) =>
    apiClient.post("/auth/login", data),

  register: (data: AuthFormData) =>
    apiClient.post("/auth/register", data),

  me: () =>
    apiClient.get("/auth/me"),
};