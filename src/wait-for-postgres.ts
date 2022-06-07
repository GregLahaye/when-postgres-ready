import { Socket } from "net";

export const waitForPostgres = async ({
  host,
  port,
  timeout,
  interval,
  wait,
}: {
  host: string;
  port: number;
  timeout: number;
  interval: number;
  wait: number;
}) => {
  await new Promise<void>((resolve, reject) => {
    const startTime = Date.now();

    const intervalId = setInterval(async () => {
      try {
        await connectToPostgres({ host, port });
        clearInterval(intervalId);
        resolve();
      } catch {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;

        if (elapsed > timeout) {
          reject();
        }
      }
    }, interval);
  });

  await sleep(wait);
};

const connectToPostgres = ({ host, port }: { host: string; port: number }) => {
  return new Promise<void>((resolve, reject) => {
    const socket = new Socket();

    const fail = () => socket.end(() => reject());

    socket.setTimeout(20_000);

    socket.on("error", () => fail());
    socket.on("timeout", () => fail());

    socket.connect({ host, port }, () => socket.end(() => resolve()));
  });
};

const sleep = (ms: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });
};
