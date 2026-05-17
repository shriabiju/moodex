import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-dark z-50">
      <div className="flex flex-col items-center gap-4">
        <motion.div
          className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.p
          className="text-white/60 text-sm font-medium"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading Moodex...
        </motion.p>
      </div>
    </div>
  );
}