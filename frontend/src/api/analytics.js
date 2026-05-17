import axios from "axios";
import { API_URL } from "../utils/constants";

const base = `${API_URL}/api/analytics`;

export const apiGetSummary      = ()        => axios.get(`${base}/summary`);
export const apiGetMoodTrend    = (days=7)  => axios.get(`${base}/mood-trend?days=${days}`);
export const apiGetSentiment    = (days=7)  => axios.get(`${base}/sentiment-trend?days=${days}`);
export const apiGetDistribution = ()        => axios.get(`${base}/mood-distribution`);
export const apiGetCorrelations = ()        => axios.get(`${base}/correlations`);