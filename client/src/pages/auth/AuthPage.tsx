import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/auth.api";
import { useAlert } from "../../hooks";
import { AlertBanner } from "../../common/AlertBanner";
import type { AuthFormData } from "../../types";

type View = "login" | "register";

const EMPTY_FORM: AuthFormData = { name: "", email: "", password: "", role: "" };

export default function AuthPage() {
  const [view, setView] = useState<View>("login");
  const [formData, setFormData] = useState<AuthFormData>(EMPTY_FORM);
  const { message, showAlert } = useAlert();
  const navigate = useNavigate();

  const switchView = (next: View) => {
    setView(next);
    setFormData(EMPTY_FORM);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password || (view === "register" && !formData.name)) {
      showAlert("Please fill out all required fields.", "error");
      return;
    }

    try {
      if (view === "register") {
        await authApi.register(formData);
        showAlert("Registered! Check your email to verify your account.", "success");
        setFormData(EMPTY_FORM);
        setTimeout(() => switchView("login"), 3000);
      } else {
        const res = await authApi.login(formData);
        const token = res.data?.result?.accessToken;
        if (token) {
          localStorage.setItem("token", token);
          window.dispatchEvent(new Event("storage"));
        }
        showAlert("Login successful! Redirecting...", "success");
        setTimeout(() => navigate("/home"), 400);
      }
    } catch (err: any) {
      showAlert(err.response?.data?.message || "An error occurred.", "error");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-gray-200 bg-white p-8 shadow-md">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold tracking-tight text-gray-900">
            {view === "login" ? "Salon Login" : "Create Salon Account"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Secure access to your appointments management panel
          </p>
        </div>

        <AlertBanner message={message} />

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {view === "register" && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text" name="name" value={formData.name} onChange={handleChange}
                  placeholder="John Doe"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="example@domain.com"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>

            {view === "register" && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                <input
                  type="text" name="role" value={formData.role} onChange={handleChange}
                  placeholder="Customer"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input
                type="password" name="password" value={formData.password} onChange={handleChange}
                placeholder="••••••••"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {view === "login" ? "Sign In" : "Register"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600 mt-4">
          {view === "login" ? (
            <p>
              Don't have an account?{" "}
              <button onClick={() => switchView("register")} className="font-medium text-indigo-600 underline">
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button onClick={() => switchView("login")} className="font-medium text-indigo-600 underline">
                Login here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}