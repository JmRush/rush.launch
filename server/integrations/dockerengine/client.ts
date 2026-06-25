import http, { IncomingMessage } from "http";

export async function pullDockerImage(
  repo: string,
  image: string,
  tag: string,
) {
  try {
    await getImageReq(repo, image, tag);
  } catch (err) {
    throw new Error("Issue pulling docker image: " + (err as Error).message);
  }
}

async function getImageReq(repo: string, image: string, tag: string) {
  const SOCKET_PATH = process.env.SOCKET_PATH;

  const fromImg = `${repo}/${image}:${tag}`;

  const options = {
    socketPath: SOCKET_PATH,
    path: `/v1.54/images/create?fromImage=${encodeURIComponent(fromImg)}`,
    method: "POST",
  };

  const req = http.request(options, (res: IncomingMessage) => {
    let body = "";
    res.on("data", (chunk: Buffer) => {
      body += chunk;
    });
    res.on("end", () => {
      console.log(body);
    });
  });
  req.end();
}
