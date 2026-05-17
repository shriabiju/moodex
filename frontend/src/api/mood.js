import axios from "axios";
import { API_URL } from "../utils/constants";

const base = `${API_URL}/api/mood`;

export const apiCreateMood  = (data)     => axios.post(`${base}/`, data);
export const apiGetMoods    = (limit=30) => axios.get(`${base}/?limit=${limit}`);
export const apiGetMood     = (id)       => axios.get(`${base}/${id}`);
export const apiUpdateMood  = (id, data) => axios.put(`${base}/${id}`, data);
export const apiDeleteMood  = (id)       => axios.delete(`${base}/${id}`);
export const apiWeeklyMoods = ()         => axios.get(`${base}/weekly`);