import {
  BadRequestError,
  InternalServerError,
} from "@/server/types/types_error";
import { env } from "../../schema/env.schema";
import { getPortsMatch } from "@/server/db/queries/activeServers";
import { ServerTypeAndMappings_T } from "@/server/schema/common.schema";
import {
  ServerPortSchema,
  ServerVolumeSchema,
} from "@/server/schema/activeserver.schema";
import { addContainerToDB } from "@/server/db/queries/activeServers";
import { ServerSchema } from "@/server/schema/activeserver.schema";
import path from "node:path";

export type Protocol = "tcp" | "udp";

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

export const createContainer = async (
  STM: ServerTypeAndMappings_T,
  userId: number,
  tag: string,
) => {
  try {
    return await postCreateContainer(STM, userId, tag);
  } catch (error) {
    throw new InternalServerError((error as Error).message);
  }
};

//to be concise, to create a container we need serverTypeId, and serverID technically

async function generatePortList(
  stm: ServerTypeAndMappings_T,
  dbContainer: ServerSchema,
) {
  let serverPorts = [];
  for (let i = 0; i < stm.ports.length; i++) {
    let port = generatePort();

    const avail = await isPortAvailable(
      port,
      stm.ports[i].protocol as Protocol,
    );

    const appPortInUse = await isAppUsingPort(
      port,
      stm.ports[i].protocol as Protocol,
    );

    if (!avail || appPortInUse) {
      i--;
      continue;
    }
    //otherwise build a port object and push it into our array

    let serverPort = {
      host_port: port,
      protocol: stm.ports[i].protocol,
      serverId: dbContainer.id,
      serverTypeId: stm.ports[i].serverTypeId,
    };

    const parsedServerPort = ServerPortSchema.parse(serverPort);
    serverPorts.push(parsedServerPort);
  }
  return serverPorts;
}

function generateVolumesList(
  stm: ServerTypeAndMappings_T,
  dbContainer: ServerSchema,
  userId: number,
) {
  let serverVolumes = [];
  const mountDir = path.join(
    `/Rush-Launch-Docker/`,
    `${stm.name}-${userId}-${new Date()}`,
  );

  //for every volume mounted on the container, we need a counterpart (ones that defined at least)
  for (let i = 0; i < stm.volumes.length; i++) {
    let newPath = path.join(mountDir, stm.volumes[i].container_path);

    let tmpVol = {
      serverTypeVolumeId: stm.volumes[i].serverTypeId,
      serverId: dbContainer.id,
      host_path: path.join(newPath, stm.volumes[i].container_path),
    };

    let newVol = ServerVolumeSchema.parse(tmpVol);
    serverVolumes.push(newVol);
  }
  return serverVolumes;
}

function getMatchingHostPort(stPortId: number, host_ports: ServerPortSchema[]) {
  for (const port of host_ports) {
    if (stPortId == port.serverTypePortId) {
      return port;
    }
  }
  return null;
}

function getMatchingHostVolume(
  stVolId: number,
  host_volumes: ServerVolumeSchema[],
) {
  for (const vol of host_volumes) {
    if (stVolId == vol.serverTypeVolumeId) {
      return vol.host_path;
    }
  }
  return null;
}

async function postCreateContainer(
  stm: ServerTypeAndMappings_T,
  userId: number,
  tag: string,
) {
  let name = `${stm.name + userId + Date.now()}`;
  //create contaienr in db
  const dbContainer = (await addContainerToDB(stm, userId, tag, name))[0];
  let parsedContainer = ServerSchema.parse(dbContainer);
  if (!dbContainer) {
    throw new InternalServerError(
      "Issue adding container information to db: postCreateContainer",
    );
  }

  let serverPorts = await generatePortList(stm, parsedContainer);
  let serverVolumes = generateVolumesList(stm, parsedContainer, userId);

  let exposedPorts = new Map(); //these are ports that are expected to be bound, or exposed to the host machine
  stm.ports.map((port) => {
    exposedPorts.set(`${port.container_port}/${port.protocol}`, {});
  });

  //objects created to actually bind the ports, who would have guessed?!
  let boundPorts = new Map();
  stm.ports.map((port) => {
    let matchingHostPort = getMatchingHostPort(port.id, serverPorts);
    if (!matchingHostPort) {
      throw new InternalServerError("ERROR GETTING MATCHING PORT");
    }
    boundPorts.set(`${port.container_port}/${port.protocol}`, [
      {
        HostPort: matchingHostPort,
      },
    ]);
  });

  let boundVolumes: String[] = [];
  stm.volumes.map((vol) => {
    let matchingVolume = getMatchingHostVolume(vol.id, serverVolumes);
    if (!matchingVolume) {
      throw new InternalServerError("ERROR GETTING MATCHING VOLUME MOUNT");
    }
    boundVolumes.push(`${matchingVolume}:${vol.container_path}`);
  });

  let containerObj = {
    Image: `${stm.namespace}/${stm.repository}:${tag}`,
    ExposedPorts: exposedPorts,
    HostConfig: {
      Binds: boundVolumes, //list of colon delimited strings host:container
      PortBindings: {
        boundPorts,
      },
      CpuShares: stm.cpuShares,
    },
  };

  const response = await fetch(
    `http://localhost/containers/create?name=${stm.name + Date.now()}`,
    {
      unix: env.SOCKET_PATH,
      method: "POST",
      body: JSON.stringify(containerObj),
    },
  );

  if (!response || !response.ok) {
    throw new InternalServerError(
      "Issue creating a container: Querying socket",
    );
  }
  const res = await response.json();
  //get the id from the response
  return {
    container: dbContainer,
    ports: serverPorts,
    volumes: serverVolumes,
    containerId: res.Id,
  };
}

//checks if port is available on HOST, we're not looking to avoid our DB ports, because that will be handled below
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

const isAppUsingPort = async (
  port: number,
  proto: Protocol,
): Promise<boolean> => {
  //call db and check if current port/protocol exist in activeServerPorts
  const result = await getPortsMatch(port, proto);
  if (!result || result.length == 0) {
    return false;
  }
  return true;
};

//we have to generate the amount of ports the serverType has, this means we need to request serverTypePorts
const generatePort = () => {
  const port =
    Math.floor(Math.random() * (env.MAX_HOST_PORT - env.MIN_HOST_PORT + 1)) +
    env.MIN_HOST_PORT;
  return port;
};
