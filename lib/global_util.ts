import { Response } from "express";

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
            const refreshResponse = await fetch("http://localhost:3001/api/auth/refresh", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                "credentials": "include",
            })

            if(refreshResponse.ok && count < 2) {
                //retry the original request
                return await safeRetry(endpoint, method, count+1, body);
            } else {
                throw new Error("Unauthorized. Please login again.");
            }
        } else if(response.ok) {
            return await response.json();
        } else {
            throw new Error("Failed to get user data: " + response.statusText);
        }
    } catch(error) {
        console.error("Error in safeRetry:", error);
        throw new Error("Internal server error: " + (error as Error).message);
    }
}