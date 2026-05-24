import { useState, useEffect } from "react";
import io from "socket.io-client";
import Navbar from "../../common/header";
import { useBulkUpload } from "../../hooks";

const socket = io("http://localhost:9006");

export default function BulkUploadPage() {
  const [showModal, setShowModal] = useState(false);
  const {
    setFile,
    progress,
    status,
    logs,
    templates,
    selectedTemplateId,
    setSelectedTemplateId,
    upload,
    handleSocketUpdate,
  } = useBulkUpload();

  useEffect(() => {
    socket.on("appointment-status-update", handleSocketUpdate);
    return () => {
      socket.off("appointment-status-update");
    };
  }, [handleSocketUpdate]);

  const handleUpload = async () => {
    const ok = await upload();
    if (!ok) alert("Please select a file and template first.");
  };

  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime()
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black">Bulk Appointment Control Center</h1>
          <button
            onClick={() => setShowModal(true)}
            className="text-indigo-600 text-sm font-semibold hover:underline"
          >
            See Required Format
          </button>
        </div>

       
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="text-sm text-slate-600"
            />
            <select
              className="border border-slate-300 p-2 rounded-lg text-sm"
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
            >
              <option value="">Select Template</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
            <button
              onClick={handleUpload}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
            >
              Start Import
            </button>
          </div>
          {status === "processing" && (
            <div className="mt-4 text-indigo-600 font-bold">Importing... {progress}%</div>
          )}
          {status === "completed" && (
            <div className="mt-4 text-green-600 font-bold">Import complete!</div>
          )}
        </div>

        {/* Format Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-xl max-w-2xl w-full shadow-2xl">
              <h2 className="text-xl font-bold mb-4">Required Excel Format</h2>
              <table className="w-full text-sm border-collapse border border-slate-200 mb-4">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="border p-2">CustomerName</th>
                    <th className="border p-2">CustomerEmail</th>
                    <th className="border p-2">ServiceName</th>
                    <th className="border p-2">AppointmentDate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-center">
                    
                    <td className="border p-2">Neha Shah</td>
                    <td className="border p-2">neha@example.com</td>
                    <td className="border p-2">Haircut</td>
                    <td className="border p-2">2026-06-01 10:00:00</td>
                  </tr>
                </tbody>
              </table>
              <button
                onClick={() => setShowModal(false)}
                className="bg-slate-800 text-white px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Live Logs */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Email</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {sortedLogs.map((log, i) => (
                <tr key={i} className="border-t hover:bg-slate-50">
                  <td className="p-4 text-sm">{log.recipient_email}</td>
                  <td className={`p-4 text-sm font-bold ${log.status === "success" ? "text-green-600" : "text-red-600"}`}>
                    {log.status.toUpperCase()}
                  </td>
                  <td className="p-4 text-sm text-slate-500">{new Date(log.sent_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}