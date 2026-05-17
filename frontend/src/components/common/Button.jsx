import { motion } from "framer-motion";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  loading = false,
}) {
  const base = "rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer";

  const variants = {
    primary:  "bg-primary hover:bg-primary/80 text-white shadow-lg shadow-primary/25",
    secondary:"bg-white/10 hover:bg-white/20 text-white border border-white/10",
    danger:   "bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/20",
    ghost:    "hover:bg-white/5 text-white/70 hover:text-white",
    gradient: "bg-gradient-to-r from-primary to-secondary text-white shadow-lg",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
    xl: "px-9 py-4 text-lg",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${
        disabled || loading ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : null}
      {children}
    </motion.button>
  );
}