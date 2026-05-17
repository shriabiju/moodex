import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import PageWrapper from "../components/layout/PageWrapper";
import Skeleton from "../components/common/Skeleton";
import { API_URL, MOOD_COLORS } from "../utils/constants";
import { formatDateShort } from "../utils/formatDate";

const CHART_COLORS = ["#9333EA", "#C084FC", "#F472B6", "#FB7185", "#FBBF24", "#34D399", "#60A5FA"];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-purple-100 rounded-xl px-4 py-3 shadow-lg text-sm">
      <p className="font-semibold text-purple-900 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: {typeof p.value === "number" ? p.value.toFixed(1) : p.value}
        </p>
      ))}
    </div>
  );
};

export default function Analytics() {
  const [moodTrend,    setMoodTrend]    = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [correlations, setCorrelations] = useState([]);
  const [summary,      setSummary]      = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [days,         setDays]         = useState(7);

  useEffect(() => { fetchAll(); }, [days]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [trendRes, distRes, corrRes, summaryRes] = await Promise.all([
        axios.get(`${API_URL}/api/analytics/mood-trend?days=${days}`),
        axios.get(`${API_URL}/api/analytics/mood-distribution`),
        axios.get(`${API_URL}/api/analytics/correlations`),
        axios.get(`${API_URL}/api/analytics/summary`),
      ]);
      setMoodTrend(trendRes.data);
      setDistribution(
        Object.entries(distRes.data).map(([name, value]) => ({ name, value }))
      );
      setCorrelations(corrRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: "Avg Stress",      value: summary?.avg_stress,      unit: "/10", color: "#F472B6", bg: "bg-pink-50",    border: "border-pink-100"   },
    { label: "Avg Energy",      value: summary?.avg_energy,      unit: "/10", color: "#9333EA", bg: "bg-purple-50",  border: "border-purple-100" },
    { label: "Sleep Quality",   value: summary?.avg_sleep,       unit: "/10", color: "#C084FC", bg: "bg-fuchsia-50", border: "border-fuchsia-100"},
    { label: "Productivity",    value: summary?.avg_productivity, unit: "/10", color: "#FBBF24", bg: "bg-amber-50",   border: "border-amber-100"  },
    { label: "Total Entries",   value: summary?.total_entries,   unit: "",    color: "#34D399", bg: "bg-emerald-50", border: "border-emerald-100"},
  ];

  return (
    <PageWrapper title="Analytics">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h2 className="text-2xl font-bold text-purple-950">Emotional Analytics</h2>
          <p className="text-purple-400 mt-1">Visualize your wellness patterns and trends.</p>
        </motion.div>

        {/* Day filter */}
        <div className="flex gap-2 mb-8">
          {[7, 14, 30].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${days === d
                  ? "gradient-bg text-white shadow-md shadow-purple-200"
                  : "bg-white text-purple-400 border border-purple-100 hover:border-purple-200"
                }`}
            >
              {d} Days
            </button>
          ))}
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {statCards.map(({ label, value, unit, color, bg, border }, i) => (
            loading ? (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ) : (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`${bg} border ${border} rounded-2xl p-4`}
              >
                <p className="text-xs font-medium text-purple-400 mb-2">{label}</p>
                <p className="text-2xl font-bold" style={{ color }}>
                  {value != null ? (typeof value === "number" ? value.toFixed(1) : value) : "—"}
                  <span className="text-sm font-normal text-purple-300">{unit}</span>
                </p>
              </motion.div>
            )
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Mood Trend Line Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-purple-50 rounded-3xl p-6 shadow-sm"
          >
            <h3 className="text-base font-semibold text-purple-900 mb-5">
              📈 Wellness Trend
            </h3>
            {loading ? <Skeleton className="h-56" /> : moodTrend.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={moodTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3E8FF" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#C084FC" }}
                    tickFormatter={(d) => formatDateShort(d)} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: "#C084FC" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="stress"      stroke="#F472B6" strokeWidth={2} dot={{ r: 3 }} name="Stress"      />
                  <Line type="monotone" dataKey="energy"      stroke="#9333EA" strokeWidth={2} dot={{ r: 3 }} name="Energy"      />
                  <Line type="monotone" dataKey="sleep"       stroke="#C084FC" strokeWidth={2} dot={{ r: 3 }} name="Sleep"       />
                  <Line type="monotone" dataKey="productivity" stroke="#FBBF24" strokeWidth={2} dot={{ r: 3 }} name="Productivity"/>
                </LineChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Mood Distribution Pie */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-purple-50 rounded-3xl p-6 shadow-sm"
          >
            <h3 className="text-base font-semibold text-purple-900 mb-5">
              🎭 Mood Distribution
            </h3>
            {loading ? <Skeleton className="h-56" /> : distribution.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {distribution.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend formatter={(val) => (
                    <span className="capitalize text-purple-700 text-sm">{val}</span>
                  )} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Sleep vs Productivity Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-purple-50 rounded-3xl p-6 shadow-sm"
          >
            <h3 className="text-base font-semibold text-purple-900 mb-5">
              😴 Sleep vs Productivity
            </h3>
            {loading ? <Skeleton className="h-56" /> : correlations.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={correlations.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3E8FF" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#C084FC" }}
                    tickFormatter={(d) => formatDateShort(d)} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: "#C084FC" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="sleep"       fill="#C084FC" radius={[4,4,0,0]} name="Sleep"       />
                  <Bar dataKey="productivity" fill="#F472B6" radius={[4,4,0,0]} name="Productivity"/>
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Stress vs Energy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white border border-purple-50 rounded-3xl p-6 shadow-sm"
          >
            <h3 className="text-base font-semibold text-purple-900 mb-5">
              ⚡ Stress vs Energy
            </h3>
            {loading ? <Skeleton className="h-56" /> : correlations.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={correlations.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3E8FF" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#C084FC" }}
                    tickFormatter={(d) => formatDateShort(d)} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: "#C084FC" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="stress" stroke="#F472B6" strokeWidth={2} dot={{ r: 3 }} name="Stress" />
                  <Line type="monotone" dataKey="energy" stroke="#9333EA" strokeWidth={2} dot={{ r: 3 }} name="Energy" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </div>

      </div>
    </PageWrapper>
  );
}

function EmptyChart() {
  return (
    <div className="h-56 flex flex-col items-center justify-center text-center">
      <p className="text-4xl mb-3">📊</p>
      <p className="text-purple-400 font-medium">No data yet</p>
      <p className="text-purple-300 text-sm mt-1">Log some moods to see your charts</p>
    </div>
  );
}