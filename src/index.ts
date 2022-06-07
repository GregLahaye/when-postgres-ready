#!/usr/bin/env node

import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

import { runScript } from "./run-command";
import { waitForPostgres } from "./wait-for-postgres";

const app = async ({
  script,
  host,
  port,
  timeout,
  interval,
}: {
  script: string;
  host: string;
  port: number;
  timeout: number;
  interval: number;
}) => {
  await waitForPostgres({ host, port, timeout, interval });
  runScript({ script });
};

yargs(hideBin(process.argv))
  .command(
    "* <script>",
    "runs the npm script when postgres is ready",
    (yargs) => {
      return yargs.positional("script", { type: "string", demandOption: true });
    },
    async (argv) => {
      const script = argv.script;
      const options = { ...argv, script } as any;
      await app(options);
    }
  )
  .option("host", {
    alias: "h",
    type: "string",
    description: "postgres host",
    default: "127.0.0.1",
  })
  .option("port", {
    alias: "p",
    type: "number",
    description: "postgres port",
    default: 5432,
  })
  .option("timeout", {
    alias: "t",
    type: "number",
    description: "postgres connection timeout",
    default: 20_000,
  })
  .option("interval", {
    alias: "i",
    type: "number",
    description: "postgres connection interval",
    default: 200,
  })
  .parse();
