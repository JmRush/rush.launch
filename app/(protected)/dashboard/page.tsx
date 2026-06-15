"use client";
import Carousel from "@/components/ui/carousel";
import { ServerType } from "@/types/api";
import { safeRetry } from "@/lib/global_util";
import { useEffect, useState } from "react";

const getServerTypes = async () => {
    try {
        const serverTypes: ServerType[] = await safeRetry("http://localhost:3001/api/server-types", "GET", 0);
        if(!serverTypes) {
            throw new Error("No server types found");
        }
        return serverTypes;
    } catch(error) {
        throw new Error((error as Error).message);
    }
}

export default function Dashboard() {
    const [serverTypes, setServerTypes] = useState<ServerType[]>([]);
    useEffect(() => {
        const fetchServerTypes = async () => {
            const serverTypes = await getServerTypes();
            setServerTypes(serverTypes);
        }
        fetchServerTypes();
    }, []);
    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to Rush.Launch</p>
            <Carousel serverTypes={serverTypes} />
        </div>
    );
}