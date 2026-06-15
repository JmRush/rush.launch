"use client";
import CarouselItem from "./carousel_item";
import { ServerType } from "@/types/api";


export default function Carousel({ serverTypes }: { serverTypes: ServerType[] }) {
    return (
        <div>
            {serverTypes && serverTypes.length> 0 ? serverTypes.map((serverType: ServerType) => {
                return <CarouselItem key={serverType.id} serverType={serverType} />;
            }) : <div>No server types found</div>}
        </div>
    );
}
//when I come back, a question that I need to have answered is, do these server components have access to AuthContext, and are they affected by it?
//if im calling the db directly from the server component, im not verifying the person on the server side because we are bypassing the endpoint in the api
//should I call the handler instead of the db directly? or should I just move to client side components for the most part?