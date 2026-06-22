"use client";
import { useRouter } from "next/navigation";
import {createContext, useContext, useEffect, useState, useCallback } from "react";
import { safeRetry } from "@/lib/global_util";

//create a context object for the auth context
const AuthContext = createContext<{
    login: (email: string, password: string, admin: boolean) => Promise<boolean>;
    logout: () => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    user: {name: string, email: string, role: string} | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    error: string | null;
}>({
    login: async () => {return false;},
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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isLoggedIn: false,
        error: null,
    });


    //call whoami endpoint to check if the user is logged in, and confirm their data
    const whoami = useCallback(async () => {
        try {
            const response = await safeRetry("http://localhost:3001/api/auth/whoami", "GET", 0);
            if(response instanceof Response && response.ok) {
                const data: {name: string, email: string, roles: string[]} = await response.json();
                setAuthState((prev) => (
                    {...prev, 
                        user: {name: data.name, email: data.email, role: data.roles[0]}, 
                        isLoggedIn: true, 
                        error: null
                    }
                ));
                return response;
            } else {
                throw new Error("Failed to get user data: " + response.statusText);
            }
        } catch(error) {
            console.error("Error in whoami:", error);
            setAuthState((prev) => ({...prev, user: null, isLoggedIn: false, error: "Failed to get user data" }));
        }
    }, [])

    //whoami on mount
    useEffect(()=> {
        setIsLoading(true);
        const fetchData = async () => {
            try {
                await whoami();
            } catch(error) {
                console.error("Error in fetchData:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    },[]);


    const login = useCallback(async (email: string, password: string, admin: boolean): Promise<boolean> => {
        setIsLoading(true);
        try {
            let endpoint = "login";
            if(admin) {
                endpoint = "admin/login";
            }
            const response = await fetch(`http://localhost:3001/api/auth/${endpoint}`, {
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
            await whoami();
            return true;
        } catch(error) {
            console.error("Error in login:", error);
            setAuthState((prev) => ({...prev, user: null, isLoggedIn: false, error: "Invalid email or password" }));
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [])

    const logout = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch("http://localhost:3001/api/auth/refresh/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                "credentials": "include",
            });
            if(!response.ok) {
                throw new Error("Failed to logout");
            }
            setAuthState((prev) => ({...prev, user: null, isLoggedIn: false, error: null}));
            router.push("/login");
        } catch(error) {
            console.error("Error in logout:", error);
            setAuthState((prev) => ({...prev, user: null, isLoggedIn: false, error: "Failed to logout" }));
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
            await whoami();
        } catch(error) {
            console.error("Error in register:", error);
            setAuthState((prev) => ({...prev, user: null, isLoggedIn: false, error: "Failed to register user" }));
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

export const useAuthRedirect =  () => {
    const { isLoggedIn, isLoading} = useAuth();
    const router = useRouter();
    //we want to redirect to the login page if the user is not logged in, but also verify that the path is correct for their role

    useEffect(() => {
        if(!isLoggedIn && !isLoading) {
            router.push("/login");
        }
    }, [isLoggedIn, isLoading, router]);

    return { isLoggedIn, isLoading };
}