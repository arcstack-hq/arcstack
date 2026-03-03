#!/usr/bin/env node

import { fileURLToPath, pathToFileURL } from "node:url";

import logo from "./logo";
import { ArcstackConsoleApp } from "./app";
import { Kernel } from "@h3ravel/musket";
import { join } from "node:path";
import { realpathSync } from "node:fs";
import { loadPrototypes } from "@arcstack/common";
import { RouteList } from "./commands/RouteList";

const loadCoreApp = async () => {
    const bootstrapPath = pathToFileURL(join(process.cwd(), "src/core/bootstrap.ts")).href;
    const module = await import(bootstrapPath);
    return module.app;
};

export interface RunConsoleOptions {
    logo?: string;
}

export const runConsoleKernel = async (options: RunConsoleOptions = {}) => {
    loadPrototypes();

    const app = await loadCoreApp();
    const stubsDir = process.env.ARCSTACK_STUBS_DIR;

    await Kernel.init(await new ArcstackConsoleApp(app, { stubsDir }).loadConfig(), {
        logo: options.logo ?? logo,
        name: "Cmd",
        baseCommands: [RouteList],
        discoveryPaths: [join(process.cwd(), "src/core/console/commands/*.ts")],
        exceptionHandler (exception) {
            throw exception;
        },
    });
};

const isEntrypointExecution = () => {
    const argvEntry = process.argv[1];

    if (!argvEntry) {
        return false;
    }

    try {
        const currentModulePath = realpathSync(fileURLToPath(import.meta.url));
        const entryPath = realpathSync(argvEntry);

        return currentModulePath === entryPath;
    } catch {
        return import.meta.url === pathToFileURL(argvEntry).href;
    }
};

if (isEntrypointExecution()) {
    await runConsoleKernel();
}
