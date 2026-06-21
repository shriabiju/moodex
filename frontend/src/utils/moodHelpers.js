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

// Metrics where a HIGHER number is WORSE (currently just stress) need their
// scale inverted before applying the standard "higher = better" color/label
// logic below — otherwise a stress level of 9 would incorrectly show as
// "Excellent" instead of "Poor".
const INVERTED_METRICS = ["stress_level"];

const normalizeScore = (score, field) =>
  INVERTED_METRICS.includes(field) ? 11 - score : score;

export const getScoreColor = (score, field) => {
  const normalized = normalizeScore(score, field);
  if (normalized >= 8) return "#6BCB77";
  if (normalized >= 5) return "#FFD93D";
  return "#FF6B6B";
};

export const getScoreLabel = (score, field) => {
  const normalized = normalizeScore(score, field);
  if (normalized >= 8) return "Excellent";
  if (normalized >= 6) return "Good";
  if (normalized >= 4) return "Fair";
  return "Poor";
};