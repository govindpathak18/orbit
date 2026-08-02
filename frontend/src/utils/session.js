export const SESSION_STORAGE_KEY = "sessionId";

export const getSessionId = () => localStorage.getItem(SESSION_STORAGE_KEY);

export const setSessionId = (sessionId) => {
    if (sessionId) {
        localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    } else {
        localStorage.removeItem(SESSION_STORAGE_KEY);
    }
};

export const clearSessionId = () => localStorage.removeItem(SESSION_STORAGE_KEY);
