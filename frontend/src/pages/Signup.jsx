import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password || !form.confirm) {
      setError("Please fill in all fields."); return;
    }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      navigate("/onboarding");
    } catch (err) {
      setError(err?.response?.data?.detail || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #F8F7FF 0%, #EEF2FF 50%, #F0FDFF 100%)" }}>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-fuchsia-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-200/40 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-purple-300/40">
            <Zap size={20} className="text-white" />
          </div>
          <span className="text-2xl font-bold gradient-text">Moodex</span>
        </div>

        <div className="glass rounded-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-purple-950 mb-1">Create account</h2>
            <p className="text-purple-400 text-sm">Start your wellness journey today</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <LightInput label="Username" type="text" value={form.username}
              onChange={handleChange("username")} placeholder="yourname" icon={User} />
            <LightInput label="Email" type="email" value={form.email}
              onChange={handleChange("email")} placeholder="you@example.com" icon={Mail} />
            <LightInput label="Password" type="password" value={form.password}
              onChange={handleChange("password")} placeholder="••••••••" icon={Lock} />
            <LightInput label="Confirm Password" type="password" value={form.confirm}
              onChange={handleChange("confirm")} placeholder="••••••••" icon={Lock} />

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </motion.p>
            )}

            <button type="submit" disabled={loading}
              className="w-full mt-2 py-3.5 gradient-bg text-white rounded-xl font-semibold
                shadow-lg shadow-purple-300/40 hover:scale-[1.02] transition-all duration-200 disabled:opacity-60">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-purple-400 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-fuchsia-600 hover:text-fuchsia-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-purple-300 text-xs mt-4">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}

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
            text-purple-900 placeholder-purple-300 text-sm pl-10
            focus:outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-100
            transition-all duration-200"
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