import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getApplications } from "../services/api";

const StatCard = ({ label, count, color }) => (
  <div
    className={`bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-2`}
  >
    <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
      {label}
    </p>
    <p className={`text-4xl font-bold ${color}`}>{count}</p>
  </div>
);

const Stats = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getApplications();
        setApplications(res.data.data);
      } catch (err) {
        setError("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const total = applications.length;
  const applied = applications.filter((a) => a.status === "applied").length;
  const interviews = applications.filter(
    (a) => a.status === "interview",
  ).length;
  const offers = applications.filter((a) => a.status === "offer").length;
  const rejected = applications.filter((a) => a.status === "rejected").length;
  const successRate = total > 0 ? Math.round((offers / total) * 100) : 0;

  // Group applications by month
  const byMonth = applications.reduce((acc, app) => {
    if (!app.applied_at) return acc;
    const month = new Date(app.applied_at).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const months = Object.entries(byMonth).sort(
    (a, b) => new Date(a[0]) - new Date(b[0]),
  );
  const maxCount = Math.max(...months.map(([, c]) => c), 1);

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
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Application Stats
        </h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <StatCard label="Total Applied" count={total} color="text-gray-800" />
          <StatCard label="In Progress" count={applied} color="text-blue-600" />
          <StatCard
            label="Interviews"
            count={interviews}
            color="text-yellow-600"
          />
          <StatCard label="Offers" count={offers} color="text-green-600" />
          <StatCard label="Rejected" count={rejected} color="text-red-500" />
          <StatCard
            label="Success Rate"
            count={`${successRate}%`}
            color="text-purple-600"
          />
        </div>

        {/* Status Breakdown Bar */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="text-md font-bold text-gray-700 mb-4">
            Status Breakdown
          </h3>
          {total === 0 ? (
            <p className="text-gray-400 text-sm">No data yet.</p>
          ) : (
            <div className="flex rounded-full overflow-hidden h-4">
              {applied > 0 && (
                <div
                  className="bg-blue-500 transition-all"
                  style={{ width: `${(applied / total) * 100}%` }}
                  title={`Applied: ${applied}`}
                />
              )}
              {interviews > 0 && (
                <div
                  className="bg-yellow-400 transition-all"
                  style={{ width: `${(interviews / total) * 100}%` }}
                  title={`Interview: ${interviews}`}
                />
              )}
              {offers > 0 && (
                <div
                  className="bg-green-500 transition-all"
                  style={{ width: `${(offers / total) * 100}%` }}
                  title={`Offer: ${offers}`}
                />
              )}
              {rejected > 0 && (
                <div
                  className="bg-red-400 transition-all"
                  style={{ width: `${(rejected / total) * 100}%` }}
                  title={`Rejected: ${rejected}`}
                />
              )}
            </div>
          )}
          <div className="flex gap-4 mt-3 flex-wrap">
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
              Applied
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
              Interview
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
              Offer
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
              Rejected
            </span>
          </div>
        </div>

        {/* Applications by Month */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-md font-bold text-gray-700 mb-6">
            Applications by Month
          </h3>
          {months.length === 0 ? (
            <p className="text-gray-400 text-sm">No data yet.</p>
          ) : (
            <div className="flex items-end gap-4 h-40">
              {months.map(([month, count]) => (
                <div
                  key={month}
                  className="flex flex-col items-center gap-2 flex-1"
                >
                  <p className="text-xs font-medium text-gray-600">{count}</p>
                  <div
                    className="bg-blue-500 rounded-t-lg w-full transition-all"
                    style={{ height: `${(count / maxCount) * 100}%` }}
                  />
                  <p className="text-xs text-gray-400">{month}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stats;
