const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3000/api";
const API_KEY = process.env.REACT_APP_API_KEY || "your-api-key-here";

export const apiConfig = {
  baseURL: API_BASE_URL,
  apiKey: API_KEY,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

export default apiConfig;
