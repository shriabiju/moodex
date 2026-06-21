import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Plus, Trash2, Edit3, Save, X, BookOpen, Smile, Meh, Frown } from "lucide-react";
import PageWrapper from "../components/layout/PageWrapper";
import Skeleton from "../components/common/Skeleton";
import { API_URL } from "../utils/constants";
import { formatDate } from "../utils/formatDate";

const SENTIMENT_CONFIG = {
  positive: { icon: Smile, color: "#10B981", bg: "bg-emerald-50", border: "border-emerald-100", label: "Positive" },
  negative: { icon: Frown, color: "#EF4444", bg: "bg-red-50",     border: "border-red-100",     label: "Negative" },
  neutral:  { icon: Meh,   color: "#6B7280", bg: "bg-gray-50",    border: "border-gray-100",    label: "Neutral"  },
};

export default function Journal() {
  const [entries, setEntries]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selected, setSelected]     = useState(null);
  const [isEditing, setIsEditing]   = useState(false);
  const [showForm, setShowForm]     = useState(false);
  const [success, setSuccess]       = useState("");
  const [form, setForm] = useState({ title: "", content: "" });
  const textareaRef = useRef(null);

  const fetchEntries = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/journal/`);
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

  useEffect(() => {
    if (showForm && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [showForm]);

  const handleCreate = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    setSubmitting(true);
    try {
      const res = await axios.post(`${API_URL}/api/journal/`, form);
      setEntries((prev) => [res.data, ...prev]);
      setForm({ title: "", content: "" });
      setShowForm(false);
      setSuccess("Journal entry saved!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    setSubmitting(true);
    try {
      const res = await axios.put(`${API_URL}/api/journal/${selected.id}`, form);
      setEntries((prev) => prev.map((e) => e.id === selected.id ? res.data : e));
      setSelected(res.data);
      setIsEditing(false);
      setSuccess("Entry updated!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this journal entry?")) return;
    try {
      await axios.delete(`${API_URL}/api/journal/${id}`);
      setEntries((prev) => prev.filter((e) => e.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (err) {
      console.error(err);
    }
  };

  const openEntry = (entry) => {
    setSelected(entry);
    setIsEditing(false);
    setShowForm(false);
  };

  const startEdit = () => {
    setForm({ title: selected.title, content: selected.content });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setForm({ title: "", content: "" });
  };

  const getSentimentConfig = (sentiment) =>
    SENTIMENT_CONFIG[sentiment] || SENTIMENT_CONFIG.neutral;

  return (
    <PageWrapper title="Journal">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h2 className="text-2xl font-bold text-indigo-950">My Journal</h2>
            <p className="text-indigo-400 mt-1">
              {entries.length} {entries.length === 1 ? "entry" : "entries"} — write freely, reflect deeply.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => { setShowForm(true); setSelected(null); setForm({ title: "", content: "" }); }}
            className="flex items-center gap-2 px-5 py-2.5 gradient-bg text-white
              rounded-xl font-semibold shadow-lg shadow-violet-200 hover:shadow-violet-300
              transition-all duration-200"
          >
            <Plus size={18} /> New Entry
          </motion.button>
        </motion.div>

        {/* Success toast */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 px-4 py-3 bg-emerald-50 border border-emerald-200
                text-emerald-700 rounded-xl text-sm font-medium"
            >
              ✅ {success}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Entry List */}
          <div className="lg:col-span-1">
            <div className="flex flex-col gap-3">
              {loading ? (
                [...Array(5)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
              ) : entries.length === 0 ? (
                <div className="bg-white border border-indigo-50 rounded-2xl p-8 text-center">
                  <BookOpen size={36} className="text-indigo-200 mx-auto mb-3" />
                  <p className="text-indigo-400 font-medium">No entries yet</p>
                  <p className="text-indigo-300 text-sm mt-1">Click "New Entry" to start</p>
                </div>
              ) : (
                entries.map((entry, i) => {
                  const sc = getSentimentConfig(entry.sentiment);
                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      onClick={() => openEntry(entry)}
                      className={`bg-white border rounded-2xl p-4 cursor-pointer
                        transition-all duration-200 hover:shadow-md
                        ${selected?.id === entry.id
                          ? "border-violet-300 shadow-md shadow-violet-100"
                          : "border-indigo-50 hover:border-indigo-100"
                        }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-indigo-900 text-sm leading-snug line-clamp-1">
                          {entry.title}
                        </h4>
                        {entry.sentiment && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                            ${sc.bg} ${sc.border} border shrink-0`}
                            style={{ color: sc.color }}>
                            {sc.label}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-indigo-400 line-clamp-2 mb-2 leading-relaxed">
                        {entry.content}
                      </p>
                      <p className="text-xs text-indigo-300">{formatDate(entry.created_at)}</p>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Panel — New Entry Form or Entry Detail */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">

              {/* New Entry Form */}
              {showForm && (
                <motion.div
                  key="new-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white border border-indigo-50 rounded-3xl p-8 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-indigo-900">New Journal Entry</h3>
                    <button onClick={() => setShowForm(false)}
                      className="text-indigo-300 hover:text-indigo-500 transition-colors">
                      <X size={20} />
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Entry title..."
                    value={form.title}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    className="w-full text-xl font-semibold text-indigo-900 placeholder-indigo-200
                      border-none outline-none bg-transparent mb-4"
                  />

                  <div className="w-full h-px bg-indigo-50 mb-4" />

                  <textarea
                    ref={textareaRef}
                    placeholder="Write your thoughts here... What happened today? How did it make you feel?"
                    value={form.content}
                    onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                    rows={12}
                    className="w-full text-indigo-800 placeholder-indigo-200 text-sm
                      leading-relaxed border-none outline-none bg-transparent resize-none"
                  />

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-indigo-50">
                    <p className="text-xs text-indigo-300">
                      {form.content.length} characters • Sentiment will be analyzed automatically
                    </p>
                    <div className="flex gap-3">
                      <button onClick={() => setShowForm(false)}
                        className="px-4 py-2 text-sm text-indigo-400 hover:text-indigo-600
                          hover:bg-indigo-50 rounded-xl transition-all">
                        Cancel
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleCreate}
                        disabled={submitting || !form.title.trim() || !form.content.trim()}
                        className="flex items-center gap-2 px-5 py-2 gradient-bg text-white
                          rounded-xl text-sm font-semibold shadow-md shadow-violet-200
                          disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <Save size={15} />
                        {submitting ? "Saving..." : "Save Entry"}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Entry Detail / Edit */}
              {selected && !showForm && (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white border border-indigo-50 rounded-3xl p-8 shadow-sm"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                        className="text-xl font-bold text-indigo-900 border-none outline-none
                          bg-indigo-50 rounded-xl px-3 py-1 flex-1 mr-4"
                      />
                    ) : (
                      <h3 className="text-xl font-bold text-indigo-900 flex-1 leading-snug">
                        {selected.title}
                      </h3>
                    )}

                    <div className="flex items-center gap-2 shrink-0">
                      {isEditing ? (
                        <>
                          <button onClick={cancelEdit}
                            className="p-2 text-indigo-300 hover:text-indigo-500
                              hover:bg-indigo-50 rounded-xl transition-all">
                            <X size={16} />
                          </button>
                          <motion.button
                            whileHover={{ scale: 1.04 }}
                            onClick={handleUpdate}
                            disabled={submitting}
                            className="flex items-center gap-1.5 px-4 py-2 gradient-bg text-white
                              rounded-xl text-sm font-semibold shadow-md disabled:opacity-50">
                            <Save size={14} />
                            {submitting ? "Saving..." : "Save"}
                          </motion.button>
                        </>
                      ) : (
                        <>
                          <button onClick={startEdit}
                            className="p-2 text-indigo-300 hover:text-violet-500
                              hover:bg-violet-50 rounded-xl transition-all">
                            <Edit3 size={16} />
                          </button>
                          <button onClick={() => handleDelete(selected.id)}
                            className="p-2 text-indigo-300 hover:text-red-500
                              hover:bg-red-50 rounded-xl transition-all">
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-xs text-indigo-300">{formatDate(selected.created_at)}</span>
                    {selected.sentiment && (() => {
                      const sc = getSentimentConfig(selected.sentiment);
                      return (
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium
                          ${sc.bg} ${sc.border} border`} style={{ color: sc.color }}>
                          {sc.label} · {selected.sentiment_score?.toFixed(2)}
                        </span>
                      );
                    })()}
                    {selected.emotional_tags && (
                      <div className="flex gap-1 flex-wrap">
                        {selected.emotional_tags.split(",").map((tag) => (
                          <span key={tag}
                            className="text-xs px-2 py-0.5 rounded-full bg-violet-50
                              border border-violet-100 text-violet-600 font-medium">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="w-full h-px bg-indigo-50 mb-5" />

                  {/* Content */}
                  {isEditing ? (
                    <textarea
                      value={form.content}
                      onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                      rows={14}
                      className="w-full text-indigo-800 text-sm leading-relaxed
                        bg-indigo-50/50 border border-indigo-100 rounded-xl px-4 py-3
                        outline-none resize-none focus:border-violet-300
                        focus:ring-2 focus:ring-violet-100 transition-all"
                    />
                  ) : (
                    <p className="text-indigo-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {selected.content}
                    </p>
                  )}
                </motion.div>
              )}

              {/* Empty state */}
              {!selected && !showForm && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white border border-indigo-50 rounded-3xl p-16
                    flex flex-col items-center justify-center text-center h-full min-h-64"
                >
                  <BookOpen size={48} className="text-indigo-200 mb-4" />
                  <h3 className="text-lg font-semibold text-indigo-400 mb-2">
                    Select an entry or create a new one
                  </h3>
                  <p className="text-indigo-300 text-sm">
                    Your journal is a safe space to reflect and grow.
                  </p>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}