import {
  BadRequestError,
  InternalServerError,
} from "@/server/types/types_error";
import { env } from "../../schema/env.schema";

type Protocol = "tcp" | "udp";

export const pullDockerImage = async (
  namespace: string,
  repository: string,
  tag: string,
) => {
  try {
    if (!namespace || !repository) {
      throw new BadRequestError("No namespace or repository found");
    }
    if (!env.SOCKET_PATH) {
      throw new InternalServerError("No socket found, cannot create container");
    }
    const result = fetchDockerImage(namespace, repository, tag);
    return result;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

async function fetchDockerImage(
  namespace: string,
  repository: string,
  tag: string,
): Promise<Boolean> {
  try {
    const response = await fetch(
      `http://localhost/images/create?fromImage=${namespace}/${repository}&tag=${tag}`,
      {
        unix: env.SOCKET_PATH,
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
    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// export const ServerSchema = z.object({
//   id: z.number(),
//   ip: z.ipv4(),
//   name: z.string(),
//   status: z.string(),
//   createdBy: z.number(),
//   updatedBy: z.number(),
//   createdAt: z.iso.date(),
//   updatedAt: z.iso.date(),
//   serverTypeId: z.number(),
// });
//
// export const ServerPortSchema = z.object({
//   id: z.int(),
//   serverId: z.int(),
//   serverTypePortId: z.int(),
//   host_port: z.int(),
//   protocol: z.string(),
// });
//
// export const ServerVolumeSchema = z.object({
//   id: z.int(),
//   serverId: z.int(),
//   serverTypeVolumeId: z.int(),
//   host_path: z.string(),
// });
export const createContainer = async (serverTypeAndMappings: any) => {
  try {
    await postCreateContainer(serverTypeAndMappings);
  } catch (error) {
    throw new InternalServerError((error as Error).message);
  }
};

async function postCreateContainer(stm: any) {
  //this should probably be called in a db trasnaction? maybe? would that help?
  //
  //ports and volume handling is priority 1 - can't create a useful container otherwise (for this proj);
  //make a call to docker engine to create a container, this involves getting free ports, checking server resources
  const response = await fetch(
    `http://localhost/containers/create?name=${name}`,
    {
      unix: env.SOCKET_PATH,
      method: "POST",
      body: JSON.stringify(stm),
    },
  );

  if (!response || !response.ok) {
    throw new InternalServerError(
      "Issue creating a container: Querying socket",
    );
  }
}

//checks if port is available on HOST, we're not looking to avoid our DB ports, because that will be handled elsewhere
const isPortAvailable = async (port: number, protocol: Protocol) => {
  try {
    if (protocol == "tcp") {
      const listener = Bun.listen({
        hostname: "0.0.0.0",
        port: port,
        socket: {
          data() {},
        },
      });
      listener.stop();
      return true;
    } else if (protocol == "udp") {
      const socket = await Bun.udpSocket({ hostname: "0.0.0.", port: port }); //should throw error
      socket.close();
      return true;
    } else {
      throw new InternalServerError(
        "protocol not currently supported in isPortAvailable",
      );
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

//For server cpu allocation I had the idea of giving servers different "weights", certain servers will be more active, or require more resources by default
//This would be a worker or something that polls the containers for activity or resource consumption and allocate resources towards that container
