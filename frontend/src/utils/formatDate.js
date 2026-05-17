export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric"
  });
};

export const formatDateShort = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
};

export const getDayName = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { weekday: "short" });
};

export const isToday = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};