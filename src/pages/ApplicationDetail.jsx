import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  getApplicationById,
  getStatusHistory,
  updateApplication,
} from "../services/api";

const STATUS_COLORS = {
  applied: "bg-blue-100 text-blue-700",
  interview: "bg-yellow-100 text-yellow-700",
  offer: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const TIMELINE_COLORS = {
  applied: "bg-blue-500",
  interview: "bg-yellow-500",
  offer: "bg-green-500",
  rejected: "bg-red-500",
};

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [appRes, historyRes] = await Promise.all([
          getApplicationById(id),
          getStatusHistory(id),
        ]);
        setApp(appRes.data);
        setForm(appRes.data);
        setHistory(historyRes.data.history);
      } catch (err) {
        setError("Failed to load application", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateApplication(id, form);
      setApp(res.data.data);
      setEditing(false);
      // refresh history
      const historyRes = await getStatusHistory(id);
      setHistory(historyRes.data.history);
    } catch (err) {
      setError("Failed to update application", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <p className="text-center text-gray-400 mt-20">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <p className="text-center text-red-500 mt-20">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back */}
        <button
          onClick={() => navigate("/dashboard")}
          className="text-blue-600 hover:underline text-sm mb-6 flex items-center gap-1"
        >
          ← Back to Dashboard
        </button>

        {/* Application Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              {editing ? (
                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  className="border border-gray-200 bg-gray-50 px-3 py-1.5 rounded-lg text-xl font-bold outline-none focus:ring-2 focus:ring-blue-500 mb-1 w-full"
                />
              ) : (
                <h2 className="text-2xl font-bold text-gray-800">
                  {app.company}
                </h2>
              )}
              {editing ? (
                <input
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="border border-gray-200 bg-gray-50 px-3 py-1.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 w-full mt-1"
                />
              ) : (
                <p className="text-gray-500 mt-1">{app.role}</p>
              )}
            </div>
            <div className="flex gap-2">
              {editing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm transition disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setForm(app);
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1.5 rounded-lg text-sm transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-1.5 rounded-lg text-sm transition font-medium"
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          {/* Status & Date */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">
                Status
              </p>
              {editing ? (
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="border border-gray-200 bg-gray-50 px-3 py-1.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 w-full"
                >
                  <option value="applied">Applied</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                </select>
              ) : (
                <span
                  className={`text-sm px-3 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[app.status]}`}
                >
                  {app.status}
                </span>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">
                Applied On
              </p>
              {editing ? (
                <input
                  name="applied_at"
                  type="date"
                  value={form.applied_at?.split("T")[0] || ""}
                  onChange={handleChange}
                  className="border border-gray-200 bg-gray-50 px-3 py-1.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
              ) : (
                <p className="text-sm text-gray-700">
                  {app.applied_at
                    ? new Date(app.applied_at).toLocaleDateString()
                    : "—"}
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="mt-4">
            <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">
              Notes
            </p>
            {editing ? (
              <textarea
                name="notes"
                value={form.notes || ""}
                onChange={handleChange}
                rows={3}
                className="border border-gray-200 bg-gray-50 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 w-full resize-none"
              />
            ) : (
              <p className="text-sm text-gray-600">{app.notes || "—"}</p>
            )}
          </div>
        </div>

        {/* Status History Timeline */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">
            Status History
          </h3>
          {history.length === 0 ? (
            <p className="text-gray-400 text-sm">No history available.</p>
          ) : (
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200" />
              <div className="flex flex-col gap-6">
                {history.map((h) => (
                  <div key={h.id} className="flex items-start gap-4 relative">
                    <div
                      className={`w-6 h-6 rounded-full shrink-0 z-10 flex items-center justify-center ${TIMELINE_COLORS[h.new_status]}`}
                    >
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 capitalize">
                        {h.old_status
                          ? `${h.old_status} → ${h.new_status}`
                          : `Started as ${h.new_status}`}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(h.changed_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;
