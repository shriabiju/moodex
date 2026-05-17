import { motion } from "framer-motion";
import { Bell, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar({ title = "Dashboard" }) {
  const { user } = useAuth();
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 right-0 left-64 h-16 bg-white/80 backdrop-blur-md
        border-b border-pink-100 flex items-center justify-between px-6 z-20 shadow-sm"
    >
      <h1 className="text-lg font-semibold text-purple-900">{title}</h1>
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-xl bg-pink-50 hover:bg-pink-100
          flex items-center justify-center text-pink-400 hover:text-fuchsia-600
          transition-all duration-200">
          <Sparkles size={16} />
        </button>
        <button className="w-9 h-9 rounded-xl bg-pink-50 hover:bg-pink-100
          flex items-center justify-center text-pink-400 hover:text-fuchsia-600
          transition-all duration-200 relative">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-fuchsia-500 rounded-full" />
        </button>
        <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center
          text-sm font-bold text-white shadow-md shadow-purple-200">
          {user?.username?.[0]?.toUpperCase() || "U"}
        </div>
      </div>
    </motion.header>
  );
}