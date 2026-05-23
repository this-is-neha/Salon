import { useState, useEffect, useCallback } from "react";
import { bulkApi } from "../api/bulk.api";
import type { NotificationLog, NotificationTemplate } from "../types";

export function useBulkUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [batchId, setBatchId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "processing" | "completed">("idle");
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");

  const fetchLogs = useCallback(async () => {
    const res = await bulkApi.getLogs();
    setLogs(res.data.logs);
  }, []);

  useEffect(() => {
    const init = async () => {
      const res = await bulkApi.getTemplates();
      setTemplates(res.data);
      await fetchLogs();
    };
    init();
  }, [fetchLogs]);

 
  const handleSocketUpdate = useCallback(
    (data: any) => {
      if (data.status === "success" || data.status === "failed") {
        setLogs((prev) => [data, ...prev]);
      }
      if (data.batchId === batchId) {
        if (data.percentage) setProgress(data.percentage);
        if (data.percentage >= 100) {
          setStatus("completed");
          fetchLogs();
        }
      }
    },
    [batchId, fetchLogs]
  );

  const upload = async () => {
    if (!file || !selectedTemplateId) return false;
    setStatus("processing");
    const res = await bulkApi.upload(file, selectedTemplateId);
    setBatchId(res.data.batchId);
    return true;
  };

  return {
    file, setFile,
    progress,
    status,
    logs,
    templates,
    selectedTemplateId, setSelectedTemplateId,
    upload,
    handleSocketUpdate,
  };
}