import { useState, useEffect } from "react";
import {
  apiGetSummary, apiGetMoodTrend,
  apiGetDistribution, apiGetCorrelations
} from "../api/analytics";
import { apiGetInsights } from "../api/insights";

export function useAnalytics(days = 7) {
  const [summary,      setSummary]      = useState(null);
  const [moodTrend,    setMoodTrend]    = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [correlations, setCorrelations] = useState([]);
  const [insights,     setInsights]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [sumRes, trendRes, distRes, corrRes, insRes] = await Promise.all([
          apiGetSummary(),
          apiGetMoodTrend(days),
          apiGetDistribution(),
          apiGetCorrelations(),
          apiGetInsights(),
        ]);
        setSummary(sumRes.data);
        setMoodTrend(trendRes.data);
        setDistribution(
          Object.entries(distRes.data).map(([name, value]) => ({ name, value }))
        );
        setCorrelations(corrRes.data);
        setInsights(insRes.data.insights);
      } catch (err) {
        setError(err?.response?.data?.detail || "Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [days]);

  return { summary, moodTrend, distribution, correlations, insights, loading, error };
}