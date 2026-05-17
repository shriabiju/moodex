import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";
import PageWrapper from "../components/layout/PageWrapper";
import Skeleton from "../components/common/Skeleton";
import { API_URL } from "../utils/constants";
import { getMoodEmoji } from "../utils/moodHelpers";

export default function WeeklyReport() {
  const [summary,  setSummary]  = useState(null);
  const [insights, setInsights] = useState([]);
  const [trend,    setTrend]    = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [summaryRes, insightsRes, trendRes] = await Promise.all([
          axios.get(`${API_URL}/api/analytics/summary`),
          axios.get(`${API_URL}/api/insights/`),
          axios.get(`${API_URL}/api/analytics/mood-trend?days=7`),
        ]);
        setSummary(summaryRes.data);
        setInsights(insightsRes.data.insights);
        setTrend(trendRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const metrics = [
    { label: "Stress",       key: "avg_stress",       emoji: "🧠", color: "#F472B6", max: 10 },
    { label: "Energy",       key: "avg_energy",       emoji: "⚡", color: "#9333EA", max: 10 },
    { label: "Sleep",        key: "avg_sleep",        emoji: "😴", color: "#C084FC", max: 10 },
    { label: "Productivity", key: "avg_productivity", emoji: "🎯", color: "#FBBF24", max: 10 },
  ];

  const topMood = summary?.mood_counts
    ? Object.entries(summary.mood_counts).sort((a, b) => b[1] - a[1])[0]
    : null;

  return (
    <PageWrapper title="Weekly Report">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h2 className="text-2xl font-bold text-purple-950">Weekly Wellness Report</h2>
          <p className="text-purple-400 mt-1">
            Your emotional summary for the past 7 days ✨
          </p>
        </motion.div>

        {/* Report Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-purple-50 rounded-3xl overflow-hidden shadow-sm mb-6"
        >
          {/* Card Header */}
          <div className="gradient-bg px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-xl mb-1">Moodex Weekly Report</h3>
                <p className="text-white/70 text-sm">
                  {new Date().toLocaleDateString("en-US", {
                    month: "long", day: "numeric", year: "numeric"
                  })}
                </p>
              </div>
              {topMood && (
                <div className="text-center">
                  <span className="text-5xl">{getMoodEmoji(topMood[0])}</span>
                  <p className="text-white/70 text-xs mt-1 capitalize">Top mood: {topMood[0]}</p>
                </div>
              )}
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 divide-x divide-y divide-purple-50">
            {metrics.map(({ label, key, emoji, color }) => (
              loading ? (
                <div key={key} className="p-6">
                  <Skeleton className="h-16" />
                </div>
              ) : (
                <div key={key} className="p-6 text-center">
                  <p className="text-2xl mb-1">{emoji}</p>
                  <p className="text-2xl font-bold" style={{ color }}>
                    {summary?.[key] != null ? summary[key].toFixed(1) : "—"}
                    <span className="text-sm font-normal text-purple-300">/10</span>
                  </p>
                  <p className="text-xs text-purple-400 font-medium mt-1">{label}</p>

                  {/* Progress bar */}
                  <div className="mt-2 h-1.5 bg-purple-50 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${((summary?.[key] || 0) / 10) * 100}%`,
                        backgroundColor: color
                      }}
                    />
                  </div>
                </div>
              )
            ))}
          </div>
        </motion.div>

        {/* Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-purple-50 rounded-3xl p-6 shadow-sm mb-6"
        >
          <h3 className="text-base font-semibold text-purple-900 mb-5">
            📊 7-Day Wellness Trend
          </h3>
          {loading ? <Skeleton className="h-52" /> : trend.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-purple-300">
              No data yet — start logging your mood!
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3E8FF" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#C084FC" }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: "#C084FC" }} />
                <Tooltip
                  contentStyle={{
                    background: "#fff", border: "1px solid #F3E8FF",
                    borderRadius: "12px", fontSize: "12px"
                  }}
                />
                <Bar dataKey="energy"      fill="#9333EA" radius={[4,4,0,0]} name="Energy"      />
                <Bar dataKey="sleep"       fill="#C084FC" radius={[4,4,0,0]} name="Sleep"       />
                <Bar dataKey="productivity" fill="#F472B6" radius={[4,4,0,0]} name="Productivity"/>
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-purple-50 rounded-3xl p-6 shadow-sm"
        >
          <h3 className="text-base font-semibold text-purple-900 mb-5">
            🤖 AI Wellness Insights
          </h3>
          {loading ? (
            <div className="flex flex-col gap-3">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {insights.map((insight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-start gap-3 p-4 rounded-2xl"
                  style={{ background: "linear-gradient(135deg, #FDF4FF, #FFF0F9)" }}
                >
                  <span className="text-lg mt-0.5">✨</span>
                  <p className="text-sm text-purple-700 leading-relaxed">{insight}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

      </div>
    </PageWrapper>
  );
}