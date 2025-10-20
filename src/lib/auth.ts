function decodeJwt(token: string): Record<string, any> | null {
    try {
        const base64 = token.split(".")[1];
        const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(json);
    } catch {
        return null;
    }
}

export function getAuthInfo() {
    const token = localStorage.getItem("access_token") || undefined;
    let username = localStorage.getItem("auth_username") || undefined;

    if (!username && token) {
        const payload = decodeJwt(token);
        // Try common claim names
        username =
            payload?.username ||
            payload?.preferred_username ||
            payload?.sub ||
            undefined;
    }

    return { isAuthenticated: !!token, token, username };
}

export function logoutAndReload() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("auth_username");
    window.location.reload();
}
