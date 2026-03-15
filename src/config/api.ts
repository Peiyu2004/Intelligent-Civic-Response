const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_KEY = process.env.REACT_APP_API_KEY || "your-api-key-here";

console.log("🔧 API Config Loaded:");
console.log("   Base URL:", API_BASE_URL);
console.log("   API Key:", API_KEY ? "✅ Set" : "❌ Not set");

export const apiConfig = {
  baseURL: API_BASE_URL,
  apiKey: API_KEY,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

export default apiConfig;
