import axios from "axios";
import { API_URL } from "../utils/constants";

const base = `${API_URL}/api/auth`;

export const apiRegister = (data) => axios.post(`${base}/register`, data);
export const apiLogin    = (data) => axios.post(`${base}/login`, data);
export const apiGetMe    = ()     => axios.get(`${base}/me`);