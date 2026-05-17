import { MOODS, MOOD_COLORS } from "./constants";

export const getMoodEmoji = (moodValue) => {
  const mood = MOODS.find((m) => m.value === moodValue);
  return mood ? mood.emoji : "😐";
};

export const getMoodColor = (moodValue) => {
  return MOOD_COLORS[moodValue] || "#ffffff";
};

export const getMoodLabel = (moodValue) => {
  const mood = MOODS.find((m) => m.value === moodValue);
  return mood ? mood.label : moodValue;
};

export const getScoreColor = (score) => {
  if (score >= 8) return "#6BCB77";
  if (score >= 5) return "#FFD93D";
  return "#FF6B6B";
};

export const getScoreLabel = (score) => {
  if (score >= 8) return "Excellent";
  if (score >= 6) return "Good";
  if (score >= 4) return "Fair";
  return "Low";
};