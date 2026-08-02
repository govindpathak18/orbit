import axios from "axios";
import { clearSessionId, getSessionId } from "./session";

const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    withCredentials: false,
});

api.interceptors.request.use((config) => {
    if (typeof window === "undefined") {
        return config;
    }

    const sessionId = getSessionId();
    const headers = config.headers || {};

    if (sessionId) {
        if (typeof headers.set === "function") {
            headers.set("Authorization", `Bearer ${sessionId}`);
            headers.set("x-session-id", sessionId);
        } else {
            headers.Authorization = `Bearer ${sessionId}`;
            headers["x-session-id"] = sessionId;
        }
    } else {
        if (typeof headers.delete === "function") {
            headers.delete("Authorization");
            headers.delete("x-session-id");
        } else {
            delete headers.Authorization;
            delete headers["x-session-id"];
        }
    }

    config.headers = headers;

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && typeof window !== "undefined") {
            clearSessionId();
        }

        return Promise.reject(error);
    }
);

export default api;