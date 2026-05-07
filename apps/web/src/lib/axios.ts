import axios from "axios";
import { env } from "./env";

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

apiClient.interceptors.response.use(
  (res) => res,
  (error: unknown) => {
    if (process.env.NODE_ENV === "development") {
      console.error("[axios] Error:", error);
    }
    return Promise.reject(error);
  },
);
