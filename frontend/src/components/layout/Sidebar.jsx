import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Smile, BookOpen,
  BarChart2, FileText, Settings, LogOut, Zap,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/mood",      icon: Smile,           label: "Mood"      },
  { to: "/journal",   icon: BookOpen,         label: "Journal"   },
  { to: "/analytics", icon: BarChart2,        label: "Analytics" },
  { to: "/report",    icon: FileText,         label: "Report"    },
  { to: "/settings",  icon: Settings,         label: "Settings"  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed left-0 top-0 h-full w-64 bg-white border-r border-pink-100
        flex flex-col z-30 px-4 py-6 shadow-sm"
    >
      <div className="flex items-center gap-2.5 px-2 mb-10">
        <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-purple-300/40">
          <Zap size={18} className="text-white" />
        </div>
        <span className="text-xl font-bold gradient-text">Moodex</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
              transition-all duration-200 group
              ${isActive
                ? "bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-100"
                : "text-purple-300 hover:text-purple-700 hover:bg-pink-50"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive
                  ? "text-fuchsia-600"
                  : "text-purple-200 group-hover:text-purple-400"} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-pink-50 pt-4 mt-4">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-sm font-bold text-white shadow-md">
            {user?.username?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-purple-900 truncate">{user?.username}</p>
            <p className="text-xs text-purple-300 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
            text-sm font-medium text-purple-300 hover:text-red-500
            hover:bg-red-50 transition-all duration-200">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </motion.aside>
  );
}