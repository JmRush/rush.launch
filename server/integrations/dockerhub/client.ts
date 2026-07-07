import { BadRequestError } from "@/server/types/types_error";
import { env } from "../../schema/env.schema";
import { Request } from "express";
import { CreateServerTypeSchema } from "@/server/schema/servertype.schema";

export type ImageData = {
  name: string;
  description: string;
  namespace: string;
  repository: string;
  tags: string[];
  imageURL: string;
  lastUpdated: Date;
  storageSize: number | null;
};

type Volume = {
  container_path: string;
  label: string;
  serverTypeId: number;
};

type Port = {
  label: string;
  protocol: string;
  container_port: number;
  serverTypeId: number;
};

//Not required for getting image data, but required for other dockerhub API calls or private containers
export const getProviderToken = async () => {
  const response = await fetch("https://hub.docker.com/v2/auth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      identifier: env.DOCKERHUB_USERNAME,
      secret: env.DOCKERHUB_PAT,
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
  if (!request.body.image_url || typeof request.body.image_url !== "string") {
    throw new BadRequestError("Image URL is required");
  }
  //verify that the host of image_url is hub.docker.com
  if (!request.body.image_url.includes("hub.docker.com")) {
    throw new BadRequestError("Invalid image URL");
  }

  //port data should be [{name string, protocol string, port number, label string, serverTypeId}]
  const ports = request.body.ports;
  //volumes data should be label, path, serverTypeId
  let volumes = request.body.volumes;
  if (!volumes || volumes.length == 0) {
    volumes = [{ container_path: "/data", label: "default" }];
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
  return parseImageData(imageData, repository, tags, apiURL, volumes, ports);
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
  volumes: Volume[],
  ports: Port[],
) => {
  imageData.apiURL = apiURL;
  imageData.storage_size = imageData.storage_size || null;
  imageData.tags = imageTags;
  imageData.repository = repository;

  const parsedImageData = CreateServerTypeSchema.parse(imageData);

  return {
    imageData: parsedImageData,
    ports: ports,
    volumes: volumes,
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
