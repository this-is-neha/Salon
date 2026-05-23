import type { AlertMessage } from "../types/index";

interface Props {
  message: AlertMessage;
}

export function AlertBanner({ message }: Props) {
  if (!message.text) return null;

  return (
    <div
      className={`mb-6 p-4 rounded-xl text-sm font-semibold border text-center transition ${
        message.type === "error"
          ? "bg-red-50 border-red-200 text-red-700"
          : "bg-green-50 border-green-200 text-green-700"
      }`}
    >
      {message.text}
    </div>
  );
}