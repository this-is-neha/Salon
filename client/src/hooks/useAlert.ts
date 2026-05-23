import { useState, useCallback } from "react";
import type { AlertMessage, AlertType } from "../types";

export function useAlert(durationMs = 4000) {
  const [message, setMessage] = useState<AlertMessage>({ text: "", type: "" });

  const showAlert = useCallback(
    (text: string, type: AlertType) => {
      setMessage({ text, type });
      setTimeout(() => setMessage({ text: "", type: "" }), durationMs);
    },
    [durationMs]
  );

  return { message, showAlert };
}