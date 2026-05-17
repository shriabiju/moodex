export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const MOODS = [
  { label: "Happy",     emoji: "😊", value: "happy",     color: "#FFD93D" },
  { label: "Calm",      emoji: "😌", value: "calm",      color: "#6BCB77" },
  { label: "Anxious",   emoji: "😰", value: "anxious",   color: "#FF6B6B" },
  { label: "Stressed",  emoji: "😤", value: "stressed",  color: "#FF8E53" },
  { label: "Sad",       emoji: "😢", value: "sad",       color: "#4D96FF" },
  { label: "Motivated", emoji: "💪", value: "motivated", color: "#C77DFF" },
  { label: "Tired",     emoji: "😴", value: "tired",     color: "#48CAE4" },
];

export const MOOD_COLORS = {
  happy:     "#FFD93D",
  calm:      "#6BCB77",
  anxious:   "#FF6B6B",
  stressed:  "#FF8E53",
  sad:       "#4D96FF",
  motivated: "#C77DFF",
  tired:     "#48CAE4",
};

export const SENTIMENT_COLORS = {
  positive: "#6BCB77",
  negative: "#FF6B6B",
  neutral:  "#48CAE4",
};

export const SLIDER_LABELS = {
  stress_level:      "Stress Level",
  energy_level:      "Energy Level",
  sleep_quality:     "Sleep Quality",
  productivity_score:"Productivity",
};