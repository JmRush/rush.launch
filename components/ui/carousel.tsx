import { getAllServerTypes } from "@/server/db/queries/serverTypes";
import { redirect } from "next/navigation";
import { ImageData } from "@/server/integrations/dockerhub/client";
import CarouselItem from "./carousel_item";
import { ServerType } from "@/server/db/schema";

//request db for applicable containers (non-privileged only)
//loop through applicable containers and create a carousel item for each
//carousel functionality - swipe left/right to see next/previous item, and loop back into the begining of the list when the end is reached


export default async function Carousel() {
    //get all server types from db
    //fetch from /api/get-server-types
    const response = await fetch("http://localhost:3001/api/get-server-types", {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        method: "GET",
    });
    if(!response.ok) {
        if(response.status === 401) {
            redirect("http://localhost:3000/login");
        }
        return <div>Failed to fetch server types</div>;
    }
    const data = await response.json();
    const serverTypes = data.serverTypes;
    if(!serverTypes) {
        return <div>No server types found</div>;
    }

    // we dont actually ever want to do this, we want to get the data from an API call, and then display it here, so it abides by our server's best practices
    return (
        <div>
            {serverTypes.map((serverType: ServerType) => {
                return (
                    <CarouselItem key={serverType.id} serverType={serverType} />
                );
            })}
        </div>
    );
}