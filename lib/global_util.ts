let refreshPromise: Promise<boolean> | null = null;

//refresh lock to prevent multiple refresh requests at the same time, this will, 
// store the current refresh promise and return the outcome of the request (true if successful, false if not)
export const tryRefresh = async (): Promise<boolean> => {
    if(!refreshPromise) {
        refreshPromise = fetch("http://localhost:3001/api/auth/refresh", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            "credentials": "include",
        }).then((response) => response.ok).finally(() => refreshPromise = null);
    }
    return refreshPromise;
}

export const safeRetry = async (endpoint: string, method: string, count: number, body?: any): Promise<any> => {
    //fetch endpoint, if we get a 401, we can try the refresh endpoint
    try {
        const response = await fetch(endpoint, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
            "credentials": "include",
            body: body ? JSON.stringify(body) : null,
        })
        if(response.status === 401) {
            //try to refresh the token
            const refreshResponse = await tryRefresh();
            if(refreshResponse === true && count < 1) { //if the refresh was successful and we haven't retried yet, retry the request
                return await safeRetry(endpoint, method, count+1, body ? body : null);
            } else {
                throw new Error("Unauthorized. Please login again.");
            }

        } else if(response.ok) {
            return response;
        } else {
            throw new Error("Failed to get user data: " + response.statusText);
        }
    } catch(error) {
        throw error;
    }
}