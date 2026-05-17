import { useState, useEffect, useCallback } from "react";
import { apiGetMoods, apiCreateMood, apiDeleteMood } from "../api/mood";

export function useMood(limit = 30) {
  const [moods,      setMoods]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchMoods = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGetMoods(limit);
      setMoods(res.data);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to load moods.");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => { fetchMoods(); }, [fetchMoods]);

  const createMood = async (data) => {
    setSubmitting(true);
    try {
      const res = await apiCreateMood(data);
      setMoods((prev) => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to save mood.");
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteMood = async (id) => {
    try {
      await apiDeleteMood(id);
      setMoods((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to delete mood.");
      throw err;
    }
  };

  return { moods, loading, error, submitting, createMood, deleteMood, refetch: fetchMoods };
}