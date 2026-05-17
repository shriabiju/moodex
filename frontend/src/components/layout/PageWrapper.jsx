import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { motion } from "framer-motion";

export default function PageWrapper({ children, title }) {
  return (
    <div className="min-h-screen flex"
      style={{ background: "linear-gradient(135deg, #FDF4FF 0%, #FAF0FE 40%, #FFF0F9 100%)" }}>
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar title={title} />
        <motion.main
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="pt-16 min-h-screen"
        >
          <div className="p-6">{children}</div>
        </motion.main>
      </div>
    </div>
  );
}