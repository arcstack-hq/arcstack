import { app } from "./core/bootstrap";
import { bootWithDetectedPort } from "@arcstack-hq/common";

await bootWithDetectedPort(async (port) => {
  await app.boot(port);
});
