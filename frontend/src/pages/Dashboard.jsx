import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Smile, BookOpen, TrendingUp,
  Zap, Moon, Brain, ArrowRight,
} from "lucide-react";
import axios from "axios";
import PageWrapper from "../components/layout/PageWrapper";
import Skeleton from "../components/common/Skeleton";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../utils/constants";
import { getMoodEmoji, getMoodColor } from "../utils/moodHelpers";
import { formatDate } from "../utils/formatDate";

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary]   = useState(null);
  const [moods, setMoods]       = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, moodsRes, insightsRes] = await Promise.all([
          axios.get(`${API_URL}/api/analytics/summary`),
          axios.get(`${API_URL}/api/mood/?limit=5`),
          axios.get(`${API_URL}/api/insights/`),
        ]);
        setSummary(summaryRes.data);
        setMoods(moodsRes.data);
        setInsights(insightsRes.data.insights);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    {
      label: "Avg Stress",
      value: summary?.avg_stress ?? "—",
      icon: Brain,
      color: "#F59E0B",
      bg: "bg-amber-50",
      border: "border-amber-100",
    },
    {
      label: "Avg Energy",
      value: summary?.avg_energy ?? "—",
      icon: Zap,
      color: "#7C3AED",
      bg: "bg-violet-50",
      border: "border-violet-100",
    },
    {
      label: "Sleep Quality",
      value: summary?.avg_sleep ?? "—",
      icon: Moon,
      color: "#06B6D4",
      bg: "bg-cyan-50",
      border: "border-cyan-100",
    },
    {
      label: "Productivity",
      value: summary?.avg_productivity ?? "—",
      icon: TrendingUp,
      color: "#10B981",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
  ];

  return (
    <PageWrapper title="Dashboard">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-indigo-950">
          Good morning, {user?.username} 👋
        </h2>
        <p className="text-indigo-400 mt-1">
          Here's your emotional wellness overview for this week.
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, bg, border }, i) => (
          loading ? (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ) : (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`${bg} border ${border} rounded-2xl p-5`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-indigo-400">{label}</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${color}20` }}>
                  <Icon size={16} style={{ color }} />
                </div>
              </div>
              <p className="text-3xl font-bold text-indigo-950">
                {typeof value === "number" ? value.toFixed(1) : value}
                <span className="text-sm font-normal text-indigo-400 ml-1">/10</span>
              </p>
            </motion.div>
          )
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Moods */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-indigo-900">Recent Moods</h3>
            <Link to="/mood"
              className="text-sm text-violet-600 hover:text-violet-700 font-medium
                flex items-center gap-1 transition-colors">
              Log mood <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col gap-3">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}
            </div>
          ) : moods.length === 0 ? (
            <div className="bg-white rounded-2xl border border-indigo-50 p-8 text-center">
              <Smile size={40} className="text-indigo-200 mx-auto mb-3" />
              <p className="text-indigo-400 font-medium">No mood entries yet</p>
              <p className="text-indigo-300 text-sm mt-1">Start tracking your mood today</p>
              <Link to="/mood"
                className="inline-block mt-4 px-5 py-2.5 gradient-bg text-white
                  rounded-xl text-sm font-medium shadow-md shadow-violet-200
                  hover:scale-105 transition-all">
                Log First Mood
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {moods.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white border border-indigo-50 rounded-2xl px-5 py-4
                    flex items-center gap-4 hover:shadow-md hover:border-indigo-100
                    transition-all duration-200"
                >
                  <span className="text-3xl">{getMoodEmoji(entry.mood)}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-indigo-900 capitalize">{entry.mood}</span>
                      <span className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: getMoodColor(entry.mood) }} />
                    </div>
                    <p className="text-xs text-indigo-300 mt-0.5">{formatDate(entry.created_at)}</p>
                  </div>
                  <div className="flex gap-3 text-xs text-indigo-400">
                    <span>😴 {entry.sleep_quality}/10</span>
                    <span>⚡ {entry.energy_level}/10</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* AI Insights */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-indigo-900">AI Insights</h3>
            <Brain size={18} className="text-violet-400" />
          </div>

          {loading ? (
            <div className="flex flex-col gap-3">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {insights.map((insight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gradient-to-br from-violet-50 to-cyan-50
                    border border-violet-100 rounded-2xl p-4"
                >
                  <p className="text-sm text-indigo-700 leading-relaxed">{insight}</p>
                </motion.div>
              ))}

              <Link to="/analytics"
                className="flex items-center justify-center gap-2 py-3 mt-1
                  text-sm font-medium text-violet-600 hover:text-violet-700
                  bg-violet-50 hover:bg-violet-100 rounded-2xl transition-all">
                View full analytics <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-indigo-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { to: "/mood",    icon: Smile,    label: "Log Mood",       sub: "How are you feeling?",    color: "#7C3AED", bg: "from-violet-50 to-purple-50",   border: "border-violet-100" },
            { to: "/journal", icon: BookOpen, label: "Write Journal",  sub: "Reflect on your day",     color: "#06B6D4", bg: "from-cyan-50 to-sky-50",        border: "border-cyan-100"   },
            { to: "/analytics",icon: TrendingUp,label:"View Analytics",sub: "See your trends",        color: "#10B981", bg: "from-emerald-50 to-teal-50",    border: "border-emerald-100"},
          ].map(({ to, icon: Icon, label, sub, color, bg, border }, i) => (
            <motion.div
              key={to}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <Link to={to}
                className={`flex items-center gap-4 p-5 bg-gradient-to-br ${bg}
                  border ${border} rounded-2xl hover:shadow-md
                  hover:scale-[1.02] transition-all duration-200`}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${color}20` }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <div>
                  <p className="font-semibold text-indigo-900">{label}</p>
                  <p className="text-xs text-indigo-400 mt-0.5">{sub}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}