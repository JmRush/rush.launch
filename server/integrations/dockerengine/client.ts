import {
  BadRequestError,
  InternalServerError,
} from "@/server/types/types_error";

export const pullDockerImage = async (
  namespace: string,
  repository: string,
  tag: string,
) => {
  try {
    if (!namespace || !repository) {
      throw new BadRequestError("No namespace or repository found");
    }
    if (!process.env.SOCKET_PATH) {
      throw new InternalServerError("No socket found, cannot create container");
    }
    await fetchDockerImage(namespace, repository, tag);
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

async function fetchDockerImage(
  namespace: string,
  repository: string,
  tag: string,
): Promise<void> {
  try {
    const response = await fetch(
      `http://localhost/images/create?fromImage=${namespace}/${repository}&tag=${tag}`,
      {
        unix: process.env.SOCKET_PATH,
        method: "POST",
      },
    );
    if (!response || !response.ok) {
      throw new InternalServerError("Issue querying socket");
    }
    const reader = response.body!.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      console.log(new TextDecoder().decode(value));
    }
  } catch (error) {
    console.error(error);
    throw new Error((error as Error).message);
  }
}

export const createContainer = async () => {};

async function fetchCreateContainer() {}

//Decide resource limitations

//Mostly ram and cpu

//Decide on port config, and how we can ensure no conflict
