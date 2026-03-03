import { app } from "./core/bootstrap";
import { bootWithDetectedPort } from "@arkstack/common";

await bootWithDetectedPort(async (port) => {
  await app.boot(port);
});
