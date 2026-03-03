// oxlint-disable typescript/no-explicit-any
import { isAbsolute, join } from "node:path";

import { CliApp } from "resora";
import { existsSync } from "node:fs";

export interface ConsoleAppOptions {
    stubsDir?: string;
}

export const resolveStubsDir = (
    config: { localStubsDir?: string } | undefined,
    options?: ConsoleAppOptions,
) => {
    const configuredDir = config?.localStubsDir;

    if (configuredDir) {
        return isAbsolute(configuredDir)
            ? configuredDir
            : join(process.cwd(), configuredDir);
    }

    return options?.stubsDir;
};

export class ArkstackConsoleApp<TCore> extends CliApp {
    core: TCore;
    private readonly options: ConsoleAppOptions;

    constructor(
        core: TCore,
        options: ConsoleAppOptions,
    ) {
        super();
        this.core = core;
        this.options = options;
    }

    makeController = (name: string, opts: any) => {
        const normalized = name.endsWith("Controller") ? name.replace(/controller/i, "") : name;

        const controllersDir = join(process.cwd(), "src/app/http/controllers");
        const controllerName = normalized.endsWith("Controller") ? normalized : `${normalized}Controller`;
        const fileName = `${controllerName}.ts`;
        const outputPath = join(controllersDir, fileName);
        const stubsDir = resolveStubsDir(this.config as any, this.options);

        if (!stubsDir) {
            console.error("Error: stubsDir is not configured. Set stubsDir in resora.config.js.");
            process.exit(1);
        }

        const stubPath = join(
            stubsDir,
            opts.model
                ? (this.config.stubs as any).model
                : opts.api
                    ? (this.config.stubs as any).api
                    : (this.config.stubs as any).controller,
        );

        if (!existsSync(stubPath)) {
            console.error(`Error: Stub file ${stubPath} not found.`);
            process.exit(1);
        }

        this.generateFile(
            stubPath,
            outputPath,
            {
                ControllerName: controllerName,
                ModelName: opts.model?.camelCase(),
                Name: controllerName.replace(/controller/i, ""),
            },
            opts,
        );

        return outputPath;
    };
}
