import axios from "axios";
import { API_URL } from "../utils/constants";

export const apiGetInsights = () => axios.get(`${API_URL}/api/insights/`);