import { useState, useEffect, useCallback } from "react";
import {
  apiGetJournals, apiCreateJournal,
  apiUpdateJournal, apiDeleteJournal
} from "../api/journal";

export function useJournal(limit = 30) {
  const [entries,    setEntries]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGetJournals(limit);
      setEntries(res.data);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to load journal.");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const createEntry = async (data) => {
    setSubmitting(true);
    try {
      const res = await apiCreateJournal(data);
      setEntries((prev) => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to save entry.");
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const updateEntry = async (id, data) => {
    setSubmitting(true);
    try {
      const res = await apiUpdateJournal(id, data);
      setEntries((prev) => prev.map((e) => e.id === id ? res.data : e));
      return res.data;
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to update entry.");
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteEntry = async (id) => {
    try {
      await apiDeleteJournal(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to delete entry.");
      throw err;
    }
  };

  return { entries, loading, error, submitting, createEntry, updateEntry, deleteEntry, refetch: fetchEntries };
}