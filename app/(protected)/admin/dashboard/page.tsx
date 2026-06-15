"use client";
import Carousel from "@/components/ui/carousel";
import { safeRetry } from "@/lib/global_util";
import { ServerType} from "@/types/api";
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

export default function AdminDashboard() {
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

            <h1>Admin Dashboard</h1>
            <p>Welcome to the admin dashboard</p>

            {/*navbar - on admin dashboard, show logout button and register user button*/
            /*this is the carousel of server types - all of these shoudl be collapsable sections*/
            /*some component that shows all the active servers*/
            /*some component that shows the overall stats of the servers*/}
            <Carousel serverTypes={serverTypes} />




        </div>
    );
}