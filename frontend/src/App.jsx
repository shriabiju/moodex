import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Landing      from "./pages/Landing";
import Login        from "./pages/Login";
import Signup       from "./pages/Signup";
import Onboarding   from "./pages/Onboarding";
import Dashboard    from "./pages/Dashboard";
import MoodTracker  from "./pages/MoodTracker";
import Journal      from "./pages/Journal";
import Analytics    from "./pages/Analytics";
import WeeklyReport from "./pages/WeeklyReport";
import Settings     from "./pages/Settings";

import ProtectedRoute from "./components/layout/ProtectedRoute";
import Loader         from "./components/common/Loader";

export default function App() {
  const { loading } = useAuth();

  if (loading) return <Loader />;

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/"         element={<Landing />} />
      <Route path="/login"    element={<Login />} />
      <Route path="/signup"   element={<Signup />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/onboarding"    element={<Onboarding />} />
        <Route path="/dashboard"     element={<Dashboard />} />
        <Route path="/mood"          element={<MoodTracker />} />
        <Route path="/journal"       element={<Journal />} />
        <Route path="/analytics"     element={<Analytics />} />
        <Route path="/report"        element={<WeeklyReport />} />
        <Route path="/settings"      element={<Settings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}