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

    if (sessionId) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${sessionId}`;
    } else {
        delete config.headers?.Authorization;
    }

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