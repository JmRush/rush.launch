"use client";
import { useAuthRedirect } from "@/Context/AuthContext";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { isLoggedIn, isLoading } = useAuthRedirect();
    if(isLoading || !isLoggedIn) {
        return <div>Loading...</div>;
    }
    return <>{children}</>;
}