import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.detail || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #F8F7FF 0%, #EEF2FF 50%, #F0FDFF 100%)" }}>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fuchsia-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-200/40 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-purple-300/40">
            <Zap size={20} className="text-white" />
          </div>
          <span className="text-2xl font-bold gradient-text">Moodex</span>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-purple-950 mb-1">Welcome back</h2>
            <p className="text-purple-400 text-sm">Sign in to your Moodex account</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <LightInput
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              placeholder="you@example.com"
              icon={Mail}
            />
            <LightInput
              label="Password"
              type="password"
              value={form.password}
              onChange={handleChange("password")}
              placeholder="••••••••"
              icon={Lock}
            />

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 gradient-bg text-white rounded-xl font-semibold
                shadow-lg shadow-purple-300/40 hover:shadow-purple-300/60
                hover:scale-[1.02] transition-all duration-200 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-purple-400 text-sm mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-fuchsia-600 hover:text-fuchsia-700 font-semibold">
              Sign up free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// Light-themed input used only on auth pages
function LightInput({ label, type = "text", value, onChange, placeholder, icon: Icon }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (show ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-purple-700">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300">
            <Icon size={16} />
          </div>
        )}
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-white border border-purple-100 rounded-xl px-4 py-3
            text-purple-900 placeholder-purple-300 text-sm
            focus:outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-100
            transition-all duration-200 pl-10"
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300 hover:text-purple-500">
            {show ? "🙈" : "👁️"}
          </button>
        )}
      </div>
    </div>
  );
}