import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: "🌸",
    title: "Welcome to Moodex!",
    subtitle: "Your personal emotional wellness companion.",
    description: "Track your mood, journal your thoughts, and discover beautiful patterns in your emotional life — all powered by AI.",
  },
  {
    icon: "😊",
    title: "Track Your Mood Daily",
    subtitle: "Takes less than 60 seconds.",
    description: "Log how you're feeling each day with our emoji-based mood picker and wellness sliders. Build a habit, discover patterns.",
  },
  {
    icon: "📓",
    title: "Journal Your Thoughts",
    subtitle: "AI reads between the lines.",
    description: "Write freely in your private journal. Our NLP engine automatically detects your emotional tone and tags your entries.",
  },
  {
    icon: "📊",
    title: "Discover Your Patterns",
    subtitle: "Beautiful analytics, real insights.",
    description: "See how your sleep affects your productivity, how stress impacts your mood, and get personalized AI wellness insights.",
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const isLast = step === steps.length - 1;

  const next = () => {
    if (isLast) navigate("/dashboard");
    else setStep((s) => s + 1);
  };

  const current = steps[step];

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #FDF4FF 0%, #FAF0FE 40%, #FFF0F9 100%)" }}>

      {/* Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">Moodex</span>
        </div>

        {/* Step Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl p-10 shadow-sm border border-purple-50 text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="text-7xl mb-6"
            >
              {current.icon}
            </motion.div>

            <h2 className="text-2xl font-bold text-purple-950 mb-2">{current.title}</h2>
            <p className="text-sm font-semibold gradient-text mb-4">{current.subtitle}</p>
            <p className="text-purple-400 text-sm leading-relaxed">{current.description}</p>
          </motion.div>
        </AnimatePresence>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <button key={i} onClick={() => setStep(i)}
              className={`rounded-full transition-all duration-300 ${
                i === step
                  ? "w-6 h-2.5 gradient-bg"
                  : "w-2.5 h-2.5 bg-purple-200 hover:bg-purple-300"
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 py-3.5 bg-white border border-purple-100 text-purple-500
                rounded-2xl font-semibold hover:bg-purple-50 transition-all"
            >
              Back
            </button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={next}
            className="flex-1 py-3.5 gradient-bg text-white rounded-2xl font-semibold
              shadow-lg shadow-purple-200 flex items-center justify-center gap-2"
          >
            {isLast ? "Get Started 🚀" : "Next"}
            {!isLast && <ArrowRight size={16} />}
          </motion.button>
        </div>

        <p className="text-center mt-4">
          <button onClick={() => navigate("/dashboard")}
            className="text-purple-300 text-sm hover:text-purple-500 transition-colors">
            Skip for now
          </button>
        </p>
      </div>
    </div>
  );
}