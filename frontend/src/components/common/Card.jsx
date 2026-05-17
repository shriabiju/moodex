import { motion } from "framer-motion";

export default function Card({
  children,
  className = "",
  hover = false,
  onClick,
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={hover ? { scale: 1.02, y: -2 } : {}}
      onClick={onClick}
      className={`glass rounded-2xl p-6 ${hover ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
}