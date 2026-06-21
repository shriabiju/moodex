import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import PageWrapper from "../components/layout/PageWrapper";
import Skeleton from "../components/common/Skeleton";
import { API_URL, MOODS } from "../utils/constants";
import { getMoodEmoji, getMoodColor, getScoreLabel } from "../utils/moodHelpers";
import { formatDate } from "../utils/formatDate";

export default function MoodTracker() {
  const [entries, setEntries]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(false);
  const [form, setForm] = useState({
    mood: "",
    stress_level: 5,
    energy_level: 5,
    sleep_quality: 5,
    productivity_score: 5,
    notes: "",
  });

  const fetchEntries = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/mood/?limit=10`);
      setEntries(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // fetchEntries is stable enough for an on-mount-only fetch.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchEntries(); }, []);

  const handleSlider = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: parseInt(e.target.value) }));
  };

  const handleSubmit = async () => {
    if (!form.mood) return alert("Please select a mood first.");
    setSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/mood/`, form);
      setSuccess(true);
      setForm({ mood: "", stress_level: 5, energy_level: 5, sleep_quality: 5, productivity_score: 5, notes: "" });
      fetchEntries();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const sliders = [
    { field: "stress_level",       label: "Stress Level",  emoji: "🧠", color: "#F59E0B" },
    { field: "energy_level",       label: "Energy Level",  emoji: "⚡", color: "#7C3AED" },
    { field: "sleep_quality",      label: "Sleep Quality", emoji: "😴", color: "#06B6D4" },
    { field: "productivity_score", label: "Productivity",  emoji: "🎯", color: "#10B981" },
  ];

  return (
    <PageWrapper title="Mood Tracker">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h2 className="text-2xl font-bold text-indigo-950">How are you feeling?</h2>
          <p className="text-indigo-400 mt-1">Track your mood and wellness metrics for today.</p>
        </motion.div>

        {/* Mood Logger Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-indigo-50 rounded-3xl p-8 shadow-sm mb-8"
        >
          {/* Mood Selector */}
          <h3 className="text-base font-semibold text-indigo-900 mb-4">Select your mood</h3>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 mb-8">
            {MOODS.map((mood) => (
              <motion.button
                key={mood.value}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setForm((prev) => ({ ...prev, mood: mood.value }))}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2
                  transition-all duration-200 cursor-pointer
                  ${form.mood === mood.value
                    ? "border-violet-400 bg-violet-50 shadow-md shadow-violet-100"
                    : "border-indigo-50 bg-indigo-50/50 hover:border-indigo-200"
                  }`}
              >
                <span className="text-3xl">{mood.emoji}</span>
                <span className={`text-xs font-medium ${
                  form.mood === mood.value ? "text-violet-700" : "text-indigo-400"
                }`}>
                  {mood.label}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Sliders */}
          <h3 className="text-base font-semibold text-indigo-900 mb-5">Rate your metrics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {sliders.map(({ field, label, emoji, color }) => (
              <div key={field}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-indigo-700">
                    {emoji} {label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold" style={{ color }}>
                      {form[field]}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${color}15`, color }}>
                      {getScoreLabel(form[field])}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={form[field]}
                    onChange={handleSlider(field)}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${color} 0%, ${color} ${(form[field] - 1) / 9 * 100}%, #E0E7FF ${(form[field] - 1) / 9 * 100}%, #E0E7FF 100%)`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-indigo-300 mt-1">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="text-sm font-medium text-indigo-700 block mb-2">
              📝 Notes <span className="text-indigo-300 font-normal">(optional)</span>
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="What's on your mind today?"
              rows={3}
              className="w-full bg-indigo-50/50 border border-indigo-100 rounded-xl px-4 py-3
                text-indigo-900 placeholder-indigo-300 text-sm resize-none
                focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100
                transition-all duration-200"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={submitting || !form.mood}
              className="px-8 py-3.5 gradient-bg text-white rounded-xl font-semibold
                shadow-lg shadow-violet-200 hover:shadow-violet-300
                disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {submitting ? "Saving..." : "Log Mood"}
            </motion.button>

            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-emerald-600 font-medium text-sm"
                >
                  ✅ Mood logged successfully!
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* History */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h3 className="text-lg font-semibold text-indigo-900 mb-4">Recent Entries</h3>

          {loading ? (
            <div className="flex flex-col gap-3">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
            </div>
          ) : entries.length === 0 ? (
            <div className="bg-white border border-indigo-50 rounded-2xl p-8 text-center">
              <p className="text-indigo-400">No entries yet. Log your first mood above!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {entries.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white border border-indigo-50 rounded-2xl px-6 py-4
                    flex items-center gap-5 hover:shadow-md hover:border-indigo-100
                    transition-all duration-200"
                >
                  <span className="text-4xl">{getMoodEmoji(entry.mood)}</span>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-indigo-900 capitalize">{entry.mood}</span>
                      <span className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: getMoodColor(entry.mood) }} />
                      <span className="text-xs text-indigo-300">{formatDate(entry.created_at)}</span>
                    </div>
                    {entry.notes && (
                      <p className="text-sm text-indigo-400 truncate max-w-xs">{entry.notes}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-indigo-400">
                    <span>🧠 Stress: <b className="text-indigo-700">{entry.stress_level}</b></span>
                    <span>⚡ Energy: <b className="text-indigo-700">{entry.energy_level}</b></span>
                    <span>😴 Sleep: <b className="text-indigo-700">{entry.sleep_quality}</b></span>
                    <span>🎯 Prod: <b className="text-indigo-700">{entry.productivity_score}</b></span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </PageWrapper>
  );
}