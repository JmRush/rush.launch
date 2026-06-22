import { BadRequestError } from "@/server/types/types_error";
import { Request } from "express";

export type ImageData = {
  name: string;
  description: string;
  namespace: string;
  repository: string;
  tags: string[];
  imageURL: string;
  pullCount: number;
  starCount: number;
  lastUpdated: string;
  storageSize: number | null;
};

//Not required for getting image data, but required for other dockerhub API calls
export const getProviderToken = async () => {
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
  if (!response.ok) {
    throw new Error("Failed to get provider token");
  }
  const data = await response.json();
  return data.access_token;
};

//get image data from dockerhub API using image URL
export const fetchImagedata = async (request: Request) => {
  if (!request.body || typeof request.body !== "object") {
    throw new BadRequestError("Request body is required");
  }
  if (!request.body.image_url || typeof request.body.image_url !== "string") {
    throw new BadRequestError("Image URL is required");
  }
  //verify that the host of image_url is hub.docker.com
  if (!request.body.image_url.includes("hub.docker.com")) {
    throw new BadRequestError("Invalid image URL");
  }

  const providerToken = await getProviderToken();
  const { namespace, repository } = getNamespaceAndRepositoryFromImageURL(
    request.body.image_url,
  );
  if (!namespace || !repository) {
    throw new BadRequestError("Invalid image URL");
  }
  //this is the URL to the image on the dockerhub website
  //const imageURL = `https://hub.docker.com/r/${namespace}/${repository}`;
  //apiURL is the URL to the image data from the dockerhub API
  const apiURL = `https://hub.docker.com/v2/namespaces/${namespace}/repositories/${repository}`;
  const imageDataResponse = await fetch(apiURL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${providerToken}`,
    },
  });

  const imageTagsResponse = await fetch(
    `https://hub.docker.com/v2/namespaces/${namespace}/repositories/${repository}/tags?page_size=20`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${providerToken}`,
      },
    },
  );

  if (!imageTagsResponse.ok) {
    throw new Error("Failed to fetch image tags");
  }
  const imageTagsData = await imageTagsResponse.json();
  const tags = imageTagsData.results.map((tag: any) => tag.name);
  if (!imageDataResponse.ok) {
    throw new Error("Failed to fetch image data");
  }
  const imageData = await imageDataResponse.json();
  console.log("imageData", imageData);
  return parseImageData(imageData, repository, tags, apiURL);
};

//helper function to get namespace and repository from image_url
export const getNamespaceAndRepositoryFromImageURL = (image_url: string) => {
  //https://hub.docker.com/r/itzg/minecraft-server - url format
  const urlParts = image_url.split("/");
  const namespace = urlParts[urlParts.length - 2];
  const repository = urlParts[urlParts.length - 1];
  return { namespace, repository };
};

//parse image data from dockerhub API response
export const parseImageData = (
  imageData: any,
  repository: string,
  imageTags: string[],
  apiURL: string,
): ImageData => {
  if (!imageData.name || typeof imageData.name !== "string") {
    throw new BadRequestError("Name is required");
  }
  if (!imageData.description || typeof imageData.description !== "string") {
    throw new BadRequestError("Description is required");
  }
  if (!imageData.namespace || typeof imageData.namespace !== "string") {
    throw new BadRequestError("Namespace is required");
  }
  if (!repository || typeof repository !== "string") {
    throw new BadRequestError("Repository is required");
  }
  if (!imageTags || !Array.isArray(imageTags)) {
    throw new BadRequestError("Tags is required and must be an array");
  }
  if (!imageData.pull_count || typeof imageData.pull_count !== "number") {
    throw new BadRequestError("Pull count is required and must be a number");
  }
  if (!imageData.star_count || typeof imageData.star_count !== "number") {
    throw new BadRequestError("Star count is required and must be a number");
  }
  if (!imageData.last_updated || typeof imageData.last_updated !== "string") {
    throw new BadRequestError("Last updated is required and must be a string");
  }
  if (
    typeof imageData.storage_size !== "number" &&
    imageData.storage_size !== null
  ) {
    throw new BadRequestError(
      "Storage size is required and must be a number or null",
    );
  }

  return {
    name: imageData.name,
    description: imageData.description,
    namespace: imageData.namespace,
    repository: repository,
    tags: imageTags,
    pullCount: imageData.pull_count,
    starCount: imageData.star_count,
    lastUpdated: imageData.last_updated,
    storageSize: imageData.storage_size,
    imageURL: apiURL,
  };
};

export const findImageTag = async (imageURL: string, imageTag: string) => {
  const providerToken = await getProviderToken();
  const { namespace, repository } =
    getNamespaceAndRepositoryFromImageURL(imageURL);
  if (!namespace || !repository) {
    throw new BadRequestError("Invalid image URL");
  }

  const response = await fetch(
    `https://hub.docker.com/v2/namespaces/${namespace}/repositories/${repository}/tags/${imageTag}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${providerToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to find image tag");
  }
  const data = await response.json();
  return data; //probably want to parse this data into a more useful format, this is just for later purposes.
};
