import axios from "axios";
import { API_URL } from "../utils/constants";

const base = `${API_URL}/api/journal`;

export const apiCreateJournal  = (data)     => axios.post(`${base}/`, data);
export const apiGetJournals    = (limit=30) => axios.get(`${base}/?limit=${limit}`);
export const apiGetJournal     = (id)       => axios.get(`${base}/${id}`);
export const apiUpdateJournal  = (id, data) => axios.put(`${base}/${id}`, data);
export const apiDeleteJournal  = (id)       => axios.delete(`${base}/${id}`);
export const apiAnalyzeText    = (text)     => axios.post(`${base}/analyze`, { text });