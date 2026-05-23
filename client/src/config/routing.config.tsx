import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { authApi } from "../api/auth.api";
import AuthPage from "../pages/auth/AuthPage";
import HomePage from "../../src/Home/home";
import ServicesPage from "../pages/service/ServicesPage";
import UserAppointmentsPage from "../pages/appointments/UserAppointmentsPage ";
import AdminAppointmentsPage from "../pages/appointments/AdminAppointmentsPage";
import BulkUploadPage from "../pages/bulk/BulkUploadPage";

function PrivateRoute({ children }: { children: ReactNode }) {
  return localStorage.getItem("token") 
    ? <>{children}</> 
    : <Navigate to="/" replace />;
}

function AdminRoute({ children, isAdmin }: { children: ReactNode; isAdmin: boolean }) {
  return isAdmin 
    ? <>{children}</> 
    : <Navigate to="/home" replace />;
}



export default function AppRouter() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState("");

  const checkSession = async () => {
    const token = localStorage.getItem("token");
    if (!token) { setIsLoggedIn(false); return; }

    try {
      const res = await authApi.me();
      setUserRole(res.data?.result?.role?.toLowerCase() ?? "");
      setIsLoggedIn(true);
    } catch {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setUserRole("");
    }
  };

  useEffect(() => {
    checkSession();
    window.addEventListener("storage", checkSession);
    return () => window.removeEventListener("storage", checkSession);
  }, []);

  if (isLoggedIn === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 font-semibold text-indigo-600">
        Authenticating...
      </div>
    );
  }

  const isAdmin = userRole === "admin";

  return (
    <Routes>
      <Route path="/" element={isLoggedIn ? <Navigate to="/home" replace /> : <AuthPage />} />

      <Route path="/home"     element={<PrivateRoute><HomePage /></PrivateRoute>} />
      <Route path="/services" element={<PrivateRoute><ServicesPage /></PrivateRoute>} />

      <Route
        path="/appointment/:serviceId/:customerId"
        element={<PrivateRoute><UserAppointmentsPage /></PrivateRoute>}
      />
      <Route
        path="/appointment/:customerId/all"
        element={<PrivateRoute><UserAppointmentsPage /></PrivateRoute>}
      />
      <Route
        path="/appointment/admin/all"
        element={<PrivateRoute><AdminRoute isAdmin={isAdmin}><AdminAppointmentsPage /></AdminRoute></PrivateRoute>}
      />
      <Route
        path="/bulk"
        element={<PrivateRoute><AdminRoute isAdmin={isAdmin}><BulkUploadPage /></AdminRoute></PrivateRoute>}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}