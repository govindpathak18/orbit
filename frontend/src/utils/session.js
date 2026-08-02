export const SESSION_STORAGE_KEY = "sessionId";

const getCookie = (name) => {
    if (typeof document === "undefined") {
        return null;
    }

    const cookie = document.cookie
        .split("; ")
        .find((item) => item.startsWith(`${name}=`));

    return cookie ? decodeURIComponent(cookie.split("=").slice(1).join("=")) : null;
};

const setCookie = (name, value) => {
    if (typeof document === "undefined") {
        return;
    }

    const maxAge = 60 * 60 * 24 * 7;
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; secure; samesite=lax`;
};

const clearCookie = (name) => {
    if (typeof document === "undefined") {
        return;
    }

    document.cookie = `${name}=; path=/; max-age=0; secure; samesite=lax`;
};

export const getSessionId = () =>
    localStorage.getItem(SESSION_STORAGE_KEY) || getCookie(SESSION_STORAGE_KEY);

export const setSessionId = (sessionId) => {
    if (sessionId) {
        localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
        setCookie(SESSION_STORAGE_KEY, sessionId);
    } else {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        clearCookie(SESSION_STORAGE_KEY);
    }
};

export const clearSessionId = () => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    clearCookie(SESSION_STORAGE_KEY);
};
