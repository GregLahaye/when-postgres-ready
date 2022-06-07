import { execSync } from "child_process";

export const runScript = ({ script }: { script: string }) => {
  try {
    execSync(`npm run ${script}`);
  } catch (e: any) {
    console.error(e.stdout.toString());

    process.exit(e.status);
  }
};
