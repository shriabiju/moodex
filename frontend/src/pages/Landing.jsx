import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  Zap, Smile, BookOpen, BarChart2,
  Brain, Shield, Sparkles, ArrowRight,
  Star, TrendingUp, Heart
} from "lucide-react";

// ── Reusable fade-in wrapper ──────────────────────────────
function FadeIn({ children, delay = 0, direction = "up" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 30 : direction === "down" ? -30 : 0,
      x: direction === "left" ? 30 : direction === "right" ? -30 : 0,
    },
    visible: { opacity: 1, y: 0, x: 0 },
  };
  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// ── Data ──────────────────────────────────────────────────
const features = [
  {
    icon: Smile,
    title: "Mood Tracking",
    description: "Log your daily mood with beautiful emoji selectors and wellness sliders. Build streaks and see patterns emerge.",
    color: "#9333EA",
    bg: "from-purple-50 to-fuchsia-50",
    border: "border-purple-100",
  },
  {
    icon: BookOpen,
    title: "Smart Journaling",
    description: "Write freely in your private journal. AI automatically detects emotional tone, tags feelings, and summarizes entries.",
    color: "#E879F9",
    bg: "from-fuchsia-50 to-pink-50",
    border: "border-fuchsia-100",
  },
  {
    icon: BarChart2,
    title: "Wellness Analytics",
    description: "Beautiful charts show your mood trends, sleep correlations, and productivity patterns over time.",
    color: "#F472B6",
    bg: "from-pink-50 to-rose-50",
    border: "border-pink-100",
  },
  {
    icon: Brain,
    title: "AI Insights",
    description: "Personalized insights like 'You feel more energized after good sleep' — generated from your own data.",
    color: "#C084FC",
    bg: "from-violet-50 to-purple-50",
    border: "border-violet-100",
  },
  {
    icon: TrendingUp,
    title: "Pattern Detection",
    description: "Automatically detect stress spikes, recurring moods, and low-energy periods before they affect your life.",
    color: "#A855F7",
    bg: "from-purple-50 to-violet-50",
    border: "border-purple-100",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description: "Your emotional data is yours. Everything is encrypted, private, and never shared with anyone.",
    color: "#D946EF",
    bg: "from-fuchsia-50 to-purple-50",
    border: "border-fuchsia-100",
  },
];

const testimonials = [
  {
    name: "Aria S.",
    role: "Designer",
    avatar: "🧑‍🎨",
    text: "Moodex helped me realize my anxiety spikes every Sunday evening. Just knowing the pattern helped me manage it.",
    stars: 5,
  },
  {
    name: "Rohan M.",
    role: "Software Engineer",
    avatar: "👨‍💻",
    text: "The sleep vs productivity chart was a wake-up call. I sleep better now and my output has improved significantly.",
    stars: 5,
  },
  {
    name: "Priya K.",
    role: "Student",
    avatar: "👩‍🎓",
    text: "I love the journaling feature. The AI tags are surprisingly accurate — it knows when I'm anxious even when I don't say it.",
    stars: 5,
  },
];

const stats = [
  { value: "10K+",  label: "Mood Entries Logged" },
  { value: "94%",   label: "Users Feel More Self-Aware" },
  { value: "3.2x",  label: "Better Emotional Clarity" },
  { value: "100%",  label: "Private & Secure" },
];

// ── Component ─────────────────────────────────────────────
export default function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden"
      style={{ background: "linear-gradient(135deg, #FDF4FF 0%, #FAF0FE 40%, #FFF0F9 100%)" }}>

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md
        border-b border-purple-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center shadow-md shadow-purple-200">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">Moodex</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login"
              className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-800
                hover:bg-purple-50 rounded-xl transition-all">
              Sign In
            </Link>
            <Link to="/signup"
              className="px-4 py-2 text-sm font-semibold gradient-bg text-white
                rounded-xl shadow-md shadow-purple-200 hover:shadow-purple-300
                hover:scale-105 transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-36 pb-24 px-6 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl" />
          <div className="absolute top-40 right-10 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-fuchsia-100/40 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full
              bg-white border border-purple-100 shadow-sm text-sm font-medium
              text-purple-600 mb-8"
          >
            <Sparkles size={14} className="text-fuchsia-500" />
            AI-powered emotional wellness analytics
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl font-bold text-purple-950 leading-tight mb-6"
          >
            Understand your emotions,{" "}
            <span className="gradient-text">transform your life</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-purple-400 leading-relaxed mb-10 max-w-2xl mx-auto"
          >
            Track moods, journal thoughts, and discover hidden patterns in your
            emotional world — all beautifully visualized and powered by AI. 🌸
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link to="/signup"
              className="flex items-center justify-center gap-2 px-8 py-4 gradient-bg
                text-white rounded-2xl font-semibold text-lg shadow-xl shadow-purple-300/40
                hover:shadow-purple-400/50 hover:scale-105 transition-all duration-200">
              Start for free
              <ArrowRight size={18} />
            </Link>
            <Link to="/login"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white
                text-purple-700 rounded-2xl font-semibold text-lg border border-purple-100
                shadow-md hover:shadow-lg hover:border-purple-200
                hover:scale-105 transition-all duration-200">
              Sign in
            </Link>
          </motion.div>

          {/* Floating emojis */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center gap-5"
          >
            {["😊", "😌", "💪", "🌸", "✨", "💜", "🦋"].map((emoji, i) => (
              <motion.span
                key={i}
                className="text-3xl cursor-default select-none"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.25, ease: "easeInOut" }}
              >
                {emoji}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="bg-white border border-purple-50 rounded-3xl p-8 shadow-sm
              grid grid-cols-2 sm:grid-cols-4 gap-8">
              {stats.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="text-3xl font-bold gradient-text mb-1">{value}</p>
                  <p className="text-sm text-purple-400 font-medium">{label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-4xl font-bold text-purple-950 mb-4">
                Everything you need to{" "}
                <span className="gradient-text">thrive emotionally</span>
              </h2>
              <p className="text-lg text-purple-400 max-w-xl mx-auto">
                A complete emotional wellness toolkit, beautifully designed and intelligently powered.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, description, color, bg, border }, i) => (
              <FadeIn key={title} delay={i * 0.08}>
                <div className={`bg-gradient-to-br ${bg} border ${border}
                  rounded-3xl p-6 h-full hover:shadow-lg hover:scale-[1.02]
                  transition-all duration-300`}>
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${color}20` }}>
                    <Icon size={22} style={{ color }} />
                  </div>
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">{title}</h3>
                  <p className="text-sm text-purple-500 leading-relaxed">{description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-4xl font-bold text-purple-950 mb-4">
                How <span className="gradient-text">Moodex</span> works
              </h2>
            </div>
          </FadeIn>

          <div className="flex flex-col gap-6">
            {[
              { step: "01", icon: "😊", title: "Log your mood daily", description: "Takes 30 seconds. Pick your mood, rate your energy, sleep, and stress. Add a quick note if you want." },
              { step: "02", icon: "📓", title: "Write in your journal", description: "Let your thoughts flow. Our AI reads your entries and automatically identifies emotional patterns." },
              { step: "03", icon: "✨", title: "Get personalized insights", description: "Discover what makes you thrive. See correlations, trends, and AI-generated wellness insights tailored to you." },
            ].map(({ step, icon, title, description }, i) => (
              <FadeIn key={step} delay={i * 0.15} direction="left">
                <div className="bg-white border border-purple-50 rounded-3xl p-6 shadow-sm
                  flex items-start gap-5 hover:shadow-md transition-all duration-200">
                  <div className="text-4xl shrink-0">{icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold gradient-text">{step}</span>
                      <h3 className="font-semibold text-purple-900 text-lg">{title}</h3>
                    </div>
                    <p className="text-purple-400 text-sm leading-relaxed">{description}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-4xl font-bold text-purple-950 mb-4">
                Loved by people who care about{" "}
                <span className="gradient-text">their wellbeing</span>
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {testimonials.map(({ name, role, avatar, text, stars }, i) => (
              <FadeIn key={name} delay={i * 0.1}>
                <div className="bg-white border border-purple-50 rounded-3xl p-6 shadow-sm
                  hover:shadow-md hover:border-purple-100 transition-all duration-200 h-full">
                  <div className="flex gap-1 mb-4">
                    {[...Array(stars)].map((_, i) => (
                      <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-purple-700 text-sm leading-relaxed mb-5">"{text}"</p>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{avatar}</span>
                    <div>
                      <p className="font-semibold text-purple-900 text-sm">{name}</p>
                      <p className="text-purple-400 text-xs">{role}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <FadeIn>
            <div className="gradient-bg rounded-3xl p-12 text-center shadow-2xl
              shadow-purple-300/40 relative overflow-hidden">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full" />
              </div>
              <div className="relative z-10">
                <Heart size={40} className="text-white/80 mx-auto mb-5" />
                <h2 className="text-3xl font-bold text-white mb-3">
                  Start your wellness journey today
                </h2>
                <p className="text-white/70 mb-8 leading-relaxed">
                  Join thousands of people who understand themselves better with Moodex.
                  Free to start, always private.
                </p>
                <Link to="/signup"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white
                    text-purple-700 rounded-2xl font-bold text-lg shadow-lg
                    hover:shadow-xl hover:scale-105 transition-all duration-200">
                  Get Started Free ✨
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 px-6 border-t border-purple-50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center
          justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-bold gradient-text">Moodex</span>
          </div>
          <p className="text-purple-300 text-sm">
            © 2025 Moodex · AI-powered emotional wellness analytics
          </p>
          <div className="flex gap-5 text-sm text-purple-300">
            <a href="#" className="hover:text-purple-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-purple-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-purple-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
}