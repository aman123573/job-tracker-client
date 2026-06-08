import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  getApplications,
  createApplication,
  deleteApplication,
} from "../services/api";

const STATUS_COLORS = {
  applied: "bg-blue-100 text-blue-700",
  interview: "bg-yellow-100 text-yellow-700",
  offer: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    company: "",
    role: "",
    status: "applied",
    notes: "",
    applied_at: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getApplications();
        setApplications(res.data.data);
      } catch (err) {
        setError("Failed to fetch applications", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await getApplications();
      setApplications(res.data.data);
    } catch (err) {
      setError("Failed to fetch applications", err);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createApplication(form);
      setForm({
        company: "",
        role: "",
        status: "applied",
        notes: "",
        applied_at: "",
      });
      setShowForm(false);
      fetchApplications();
    } catch (err) {
      setError("Failed to add application", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    try {
      await deleteApplication(id);
      fetchApplications();
    } catch (err) {
      setError("Failed to delete application", err);
    }
  };

  const filtered =
    filter === "all"
      ? applications
      : applications.filter((a) => a.status === filter);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Applications</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-medium text-sm"
          >
            {showForm ? "Cancel" : "+ Add Application"}
          </button>
        </div>

        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        {/* Add Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 p-6 rounded-2xl mb-6 grid grid-cols-2 gap-4 shadow-sm"
          >
            <input
              name="company"
              placeholder="Company"
              value={form.company}
              onChange={handleChange}
              required
              className="border border-gray-200 bg-gray-50 px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
            <input
              name="role"
              placeholder="Role"
              value={form.role}
              onChange={handleChange}
              required
              className="border border-gray-200 bg-gray-50 px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border border-gray-200 bg-gray-50 px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            >
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </select>
            <input
              name="applied_at"
              type="date"
              value={form.applied_at}
              onChange={handleChange}
              className="border border-gray-200 bg-gray-50 px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
            <textarea
              name="notes"
              placeholder="Notes (optional)"
              value={form.notes}
              onChange={handleChange}
              className="border border-gray-200 bg-gray-50 px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 col-span-2 resize-none"
              rows={2}
            />
            <button
              type="submit"
              disabled={submitting}
              className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-50"
            >
              {submitting ? "Adding..." : "Add Application"}
            </button>
          </form>
        )}

        {/* Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["all", "applied", "interview", "offer", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition
                ${filter === s ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-100"}`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Applications List */}
        {loading ? (
          <p className="text-gray-400 text-center">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-400 text-center">No applications found.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((app) => (
              <div
                key={app.id}
                className="bg-white border border-gray-200 p-5 rounded-2xl flex justify-between items-center hover:shadow-md transition shadow-sm"
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => navigate(`/applications/${app.id}`)}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {app.company}
                    </h3>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${STATUS_COLORS[app.status]}`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">{app.role}</p>
                  {app.applied_at && (
                    <p className="text-gray-400 text-xs mt-1">
                      Applied: {new Date(app.applied_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(app.id)}
                  className="text-red-400 hover:text-red-600 ml-4 transition text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
