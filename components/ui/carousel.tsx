"use client";
import CarouselItem from "./carousel_item";
import { ServerType } from "@/types/api";

export default function Carousel({
  serverTypes,
}: {
  serverTypes: ServerType[];
}) {
  return (
    <div>
      {serverTypes && serverTypes.length > 0 ? (
        serverTypes.map((serverType: ServerType) => {
          return <CarouselItem key={serverType.id} serverType={serverType} />;
        })
      ) : (
        <div>No server types found</div>
      )}
    </div>
  );
}
