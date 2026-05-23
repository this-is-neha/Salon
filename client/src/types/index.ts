

export interface SalonService {
  id: string;
  name: string;
  description: string;
  price: number | string;
  duration_minutes: number;
  is_active: boolean;
  created_at?: string;
}

export interface Appointment {
  id: string;
  customer_id: string;
  customer_name?: string;
  service_id: string;
  service_name?: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
}

export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface NotificationTemplate {
  id: string;
  title: string;
}

export interface NotificationLog {
  recipient_email: string;
  status: "success" | "failed";
  sent_at: string;
}


export interface DecodedToken {
  sub: string;
  role: string;
  id?: string;
  exp?: number;
}

export interface AuthFormData {
  name: string;
  email: string;
  password: string;
  role: string;
}


export interface ServiceFormData {
  name: string;
  description: string;
  price: string;
  duration_minutes: number;
}

export interface AppointmentFormData {
  service_id: string;
  selected_date: string;
  selected_slot: string;
}


export type AlertType = "success" | "error" | "";

export interface AlertMessage {
  text: string;
  type: AlertType;
}