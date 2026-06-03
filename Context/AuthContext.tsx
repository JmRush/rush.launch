"use client";
import { useRouter } from "next/navigation";
import {createContext, useContext, useEffect, useState, useCallback } from "react";
import { safeRetry } from "@/lib/global_util";

//create a context object for the auth context
const AuthContext = createContext<{
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    user: {name: string, email: string, role: string} | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    error: string | null;
}>({
    login: async () => {},
    logout: async () => {},
    register: async () => {},
    user: null,
    isLoggedIn: false,
    isLoading: true,
    error: null,
})

type AuthState = {
    user: {name: string, email: string, role: string} | null;
    isLoggedIn: boolean;
    error: string | null;
}
//safe retry for protected routes that require tokens, (refresh)

//if the token is expired, we need to refresh it

//create the provider, which actually holds the states and the logic

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isLoggedIn: false,
        error: null,
    });

    //call whoami endpoint to get the user data
    const whoami = useCallback(async () => {
        try {
            const response = await safeRetry("http://localhost:3001/api/auth/whoami", "GET", 0);
            if(response instanceof Response && response.ok) {
                const data: {name: string, email: string, roles: string[]} = await response.json();
                setAuthState({
                    user: {name: data.name, email: data.email, role: data.roles[0]},
                    isLoggedIn: true,
                    error: null,
                });
            } else {
                throw new Error("Failed to get user data: " + response.statusText);
            }
        } catch(error) {
            console.error("Error in whoami:", error);
            setAuthState({
                user: null,
                isLoggedIn: false,
                error: (error as Error).message,
            });
        }
    }, [])

    //whoami on mount
    useEffect(()=> {
        setIsLoading(true);
        const fetchData = async () => {
            try {
                await whoami();
                if(authState.error) {
                    console.error("Auth error:", authState.error);
                    router.push("/login");
                }
            } catch(error) {
                console.error("Error in fetchData:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    },[]);


    const login = useCallback(async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:3001/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                "credentials": "include",
                body: JSON.stringify({ email, password }),
            });
            if(!response.ok) {
                throw new Error("Invalid email or password");
            }
            const data = await response.json();
            setAuthState({
                user: {name: data.name, email: data.email, role: data.roles[0]},
                isLoggedIn: true,
                error: null,
            });
        } catch(error) {
            console.error("Error in login:", error);
            setAuthState({
                user: null,
                isLoggedIn: false,
                error: (error as Error).message,
            });
        } finally {
            setIsLoading(false);
        }
    }, [])

    const logout = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch("http://localhost:3001/api/auth/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                "credentials": "include",
            });
            if(!response.ok) {
                throw new Error("Failed to logout");
            }
            setAuthState({
                user: null,
                isLoggedIn: false,
                error: null,
            });
            router.push("/login");
        } catch(error) {
            console.error("Error in logout:", error);
            setAuthState({
                user: null,
                isLoggedIn: false,
                error: (error as Error).message,
            });
        } finally {
            setIsLoading(false);
        }
    }, [])

    const register = useCallback(async (name: string, email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:3001/api/auth/admin/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                "credentials": "include",
                body: JSON.stringify({ email, password, name }),
            });
            if(!response.ok) {
                throw new Error("Failed to register");
            }
            //if the response is ok, we need to set the auth state
            const data = await response.json();
            if(data.success) {
                setAuthState({
                    user: {name: data.name, email: data.email, role: data.roles[0]},
                    isLoggedIn: true,
                    error: null,
                });
            } else {
                throw new Error("Failed to register");
            }
        } catch(error) {
            console.error("Error in register:", error);
            setAuthState({
                user: null,
                isLoggedIn: false,
                error: (error as Error).message,
            });
        } finally {
            setIsLoading(false);
        }
    }, [])

    return (<AuthContext.Provider value={{ login, logout, register, user: authState.user, isLoggedIn: authState.isLoggedIn, isLoading: isLoading, error: authState.error}}>
        {children}
    </AuthContext.Provider>);
};

//create the hook, which actually uses the context and returns the data to the component
export const useAuth = () => {
    return useContext(AuthContext);
}