import { detect } from "detect-port";

export const bootWithDetectedPort = async (
  boot: (port: number) => Promise<void>,
  preferredPort: number = 3000,
) => {
  const port = await detect(preferredPort);
  await boot(port);
};
