//"use client";

//import { createContext, useContext, useState, useEffect} from "react";
//import { userRoles } from "@/server/types/types_roles";

//type AuthUser = {
    //email: string;
    //role: userRoles.ADMIN | userRoles.USER;
//}

//type LoginInput = {
    //email: string;
    //password: string;
    //admin?: boolean;
//}

//type AuthContextValue = {
    //user: AuthUser | null;
    //isLoading: boolean;
    //isAuthenticated: boolean;
    //login: (input: LoginInput) => Promise<void>;
    //logout: () => Promise<void>;
    //error: string | null;
//}

//export const AuthConext = createContext<AuthContextValue | null>(null);

//export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    //const [user, setUser] = useState<AuthUser | null>(null);
    //const [isLoading, setIsLoading] = useState(true);

    //const refresUser = useCallback(async () => {
        //setIsLoading(true);

        //const response = await fetch("http://localhost/3001/api/refresh")

    //}, [])

//}