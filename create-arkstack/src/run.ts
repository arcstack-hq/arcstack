#!/usr/bin/env node

import { CreateArkstackCommand } from "./Commands/CreateArkstackCommand";
import { Kernel } from "@h3ravel/musket";

class Application { }

Kernel.init(new Application(), {
  rootCommand: CreateArkstackCommand,
});
