import { useState } from "react";
import { motion } from "framer-motion";
import { User, Bell, Palette, Shield } from "lucide-react";
import PageWrapper from "../components/layout/PageWrapper";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    weeklyReport:  true,
    insights:      false,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const sections = [
    {
      icon: User,
      title: "Profile",
      color: "#9333EA",
      bg: "bg-purple-50",
      content: (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-purple-700 block mb-1.5">Username</label>
            <input
              defaultValue={user?.username}
              className="w-full bg-purple-50/50 border border-purple-100 rounded-xl
                px-4 py-3 text-purple-900 text-sm outline-none
                focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-purple-700 block mb-1.5">Email</label>
            <input
              defaultValue={user?.email}
              type="email"
              className="w-full bg-purple-50/50 border border-purple-100 rounded-xl
                px-4 py-3 text-purple-900 text-sm outline-none
                focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all"
            />
          </div>
        </div>
      ),
    },
    {
      icon: Bell,
      title: "Notifications",
      color: "#F472B6",
      bg: "bg-pink-50",
      content: (
        <div className="flex flex-col gap-4">
          {[
            { key: "dailyReminder", label: "Daily mood reminder",    sub: "Get reminded to log your mood each day" },
            { key: "weeklyReport",  label: "Weekly wellness report", sub: "Receive your weekly summary every Monday" },
            { key: "insights",      label: "AI insight alerts",      sub: "Be notified when new patterns are detected" },
          ].map(({ key, label, sub }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-900">{label}</p>
                <p className="text-xs text-purple-400 mt-0.5">{sub}</p>
              </div>
              <button
                onClick={() => setNotifications((p) => ({ ...p, [key]: !p[key] }))}
                className={`w-11 h-6 rounded-full transition-all duration-300 relative ${
                  notifications[key] ? "gradient-bg" : "bg-purple-100"
                }`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow
                  transition-all duration-300 ${notifications[key] ? "left-5" : "left-0.5"}`}
                />
              </button>
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: Palette,
      title: "Appearance",
      color: "#C084FC",
      bg: "bg-fuchsia-50",
      content: (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-purple-400">
            Theme customization coming soon! For now, edit <code className="bg-purple-50 px-1.5 py-0.5 rounded text-purple-600 text-xs">index.css</code> to change colors.
          </p>
          <div className="flex gap-3 mt-2">
            {["#9333EA", "#E879F9", "#F472B6", "#FB923C", "#34D399", "#60A5FA"].map((color) => (
              <button key={color}
                className="w-8 h-8 rounded-full border-2 border-white shadow-md hover:scale-110 transition-all"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      color: "#FBBF24",
      bg: "bg-amber-50",
      content: (
        <div className="flex flex-col gap-3 text-sm text-purple-700">
          <p>🔒 Your journal entries are private and encrypted.</p>
          <p>🧠 AI analysis runs locally — your data is never shared.</p>
          <p>📦 You can export or delete your data anytime.</p>
          <button className="mt-2 text-red-400 hover:text-red-600 text-sm font-medium
            text-left transition-colors">
            Delete my account
          </button>
        </div>
      ),
    },
  ];

  return (
    <PageWrapper title="Settings">
      <div className="max-w-2xl mx-auto">

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h2 className="text-2xl font-bold text-purple-950">Settings</h2>
          <p className="text-purple-400 mt-1">Manage your account and preferences.</p>
        </motion.div>

        <div className="flex flex-col gap-5">
          {sections.map(({ icon: Icon, title, color, bg, content }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white border border-purple-50 rounded-3xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center`}>
                  <Icon size={18} style={{ color }} />
                </div>
                <h3 className="font-semibold text-purple-900">{title}</h3>
              </div>
              {content}
            </motion.div>
          ))}
        </div>

        {/* Save button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex items-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            className="px-8 py-3 gradient-bg text-white rounded-xl font-semibold
              shadow-lg shadow-purple-200 transition-all"
          >
            Save Changes
          </motion.button>
          {saved && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-emerald-500 text-sm font-medium"
            >
              ✅ Settings saved!
            </motion.p>
          )}
        </motion.div>

      </div>
    </PageWrapper>
  );
}