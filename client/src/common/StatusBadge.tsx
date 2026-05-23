import type { AppointmentStatus } from "../types/index";

const colorMap: Record<AppointmentStatus, string> = {
  confirmed: "bg-green-50 text-green-700 border-green-200",
  cancelled:  "bg-red-50 text-red-700 border-red-200",
  completed:  "bg-blue-50 text-blue-700 border-blue-200",
  pending:    "bg-amber-50 text-amber-700 border-amber-200",
};

interface Props {
  status: AppointmentStatus;
}

export function StatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${colorMap[status]}`}
    >
      {status.toUpperCase()}
    </span>
  );
}