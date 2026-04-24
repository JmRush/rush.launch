export default function CarouselItem() {
    //get data from props passed in, and display a card with the data passed in - game, name, description, image, and a button to launch the container
    //example data:
    //{
    //    game: "Minecraft",
    //    name: "Vanilla Minecraft 1.20.1",
    //    description: "A vanilla minecraft 1.20.1 server with no mods",
    //    image: "https://bouncycastlenetwork-res.cloudinary.com/image/upload/f_auto,q_auto,c_limit,w_1000/0460b7c17e46fcc90018ebb5e59129d2", (but local probbably or cdn hosted)
    //}

    return (
        <div>
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold">Carousel Item</h1>
                <p className="text-sm text-gray-500">Carousel Item Description</p>
            </div>
        </div>
    );
}