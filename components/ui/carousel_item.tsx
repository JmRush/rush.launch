import { ServerType } from "@/server/db/schema";

export default function CarouselItem({ serverType }: { serverType: ServerType }) {
    //get data from props passed in, and display a card with the data passed in - game, name, description, image, and a button to launch the container
    //example data:
    //{
    //    game: "Minecraft",
    //    name: "Vanilla Minecraft 1.20.1",
    //    description: "A vanilla minecraft 1.20.1 server with no mods",
    //    image: "server.imageURL"
    //}

    return (
        <div className="w-full h-full" data-carousel-item>
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold">{serverType.namespace}/{serverType.repository}</h1>
                <p className="text-sm text-gray-500">{serverType.description}</p>
                <p className="text-sm text-gray-500">Pull Count: {serverType.pullCount}</p>
                <p className="text-sm text-gray-500">Star Count: {serverType.starCount}</p>
                <p className="text-sm text-gray-500">Last Updated: {new Date(serverType.lastUpdated).toISOString()}</p>
                <p className="text-sm text-gray-500">Storage Size: {serverType.storageSize}</p>
                <p className="text-sm text-gray-500">Tags: {serverType.tags.join(", ")}</p>
                <p className="text-sm text-gray-500">Image URL: {serverType.imageUrl}</p>
            </div>
        </div>
    );
}