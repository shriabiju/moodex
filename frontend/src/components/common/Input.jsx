import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  error = "",
  disabled = false,
  className = "",
  icon: Icon,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-white/70">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
            <Icon size={16} />
          </div>
        )}
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full bg-white/5 border ${
            error ? "border-red-500/50" : "border-white/10"
          } rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm
          focus:outline-none focus:border-primary/60 focus:bg-white/8
          transition-all duration-200 ${Icon ? "pl-10" : ""} ${
            isPassword ? "pr-10" : ""
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}