import { BadRequestError } from "@/server/types/types_error";
import { Request, Response } from "express";

//Not required for getting image data, but required for other dockerhub API calls
export const getProviderToken = async() => {
    const response = await fetch("https://hub.docker.com/v2/auth/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            identifier: process.env.DOCKERHUB_USERNAME,
            secret: process.env.DOCKERHUB_PAT,
        }),
    });
    if(!response.ok) {
        throw new Error("Failed to get provider token");
    }
    const data = await response.json();
    return data.access_token;
}



export const fetchImagedata = async (request: Request, response: Response) => {
    if(!request.body) {
        throw new BadRequestError("Request body is required");
    }
    if(!request.body.image_url) {
        throw new BadRequestError("Image URL is required");
    }
    if(typeof request.body.image_url !== "string") {
        throw new BadRequestError("Image URL must be a string");
    }

    const providerToken = await getProviderToken();
    //verify that the host is hub.docker.com
    const { namespace, repository } = getNamespaceAndRepositoryFromImageURL(request.body.image_url);
    if(!namespace || !repository) {
        throw new BadRequestError("Invalid image URL");
    }
    const imageDataResponse = await fetch(`https://hub.docker.com/v2/namespaces/${namespace}/repositories/${repository}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${providerToken}`,
        },
    });
    if(!imageDataResponse.ok) {
        throw new Error("Failed to fetch image data");
    }
    const data = await imageDataResponse.json();
    return data;
}

//helper function to get namespace and repository from image_url
function getNamespaceAndRepositoryFromImageURL(image_url: string) {
    //https://hub.docker.com/r/itzg/minecraft-server - url format
    const urlParts = image_url.split("/");
    const namespace = urlParts[urlParts.length-2];
    const repository = urlParts[urlParts.length-1];
    return { namespace, repository };
}


//store image data in the database as a server type