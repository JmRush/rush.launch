import { getAllServerTypes } from "@/server/db/queries/serverTypes";
import { ImageData } from "@/server/integrations/dockerhub/client";
import CarouselItem from "./carousel_item";
import { ServerType } from "@/server/db/schema";

//request db for applicable containers (non-privileged only)
//loop through applicable containers and create a carousel item for each
//carousel functionality - swipe left/right to see next/previous item, and loop back into the begining of the list when the end is reached


export default async function Carousel() {
    //get all server types from db
    const serverTypes = await getAllServerTypes();
    //loop through applicable docker containers and create a carousel item for each
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