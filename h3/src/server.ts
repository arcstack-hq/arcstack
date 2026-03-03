import { app } from "./core/bootstrap";
import { bootWithDetectedPort } from "@arcstack/common";

await bootWithDetectedPort(async (port) => {
  await app.boot(port);
});
