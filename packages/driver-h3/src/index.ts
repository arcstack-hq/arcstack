import { H3, serve } from "h3";

import { ArcstackKitDriver } from "@arcstack/contract";
import { Middleware as H3BaseMiddleware } from "clear-router/types/h3";

export type H3Middleware = H3BaseMiddleware | [H3BaseMiddleware, Record<string, any>];

export interface H3DriverOptions {
    bindRouter: (app: H3) => void;
    mountPublicAssets: (app: H3, publicPath: string) => void;
    createApp?: () => H3;
}

/**
 * The H3Driver class implements the ArcstackKitDriver contract for the H3 framework.
 */
export class H3Driver extends ArcstackKitDriver<H3, H3Middleware> {
    readonly name = "h3";
    private readonly options: H3DriverOptions;

    /**
     * Creates an instance of H3Driver.
     * 
     * @param options 
     */
    constructor(options: H3DriverOptions) {
        super();
        this.options = options;
    }

    /**
     * Creates an H3 application instance.
     * 
     * @returns 
     */
    createApp (): H3 {
        return this.options.createApp?.() ?? new H3();
    }

    /**
     * Mounts static assets from the specified public path to the H3 application.
     * 
     * @param app 
     * @param publicPath 
     */
    mountPublicAssets (app: H3, publicPath: string): void {
        this.options.mountPublicAssets(app, publicPath);
    }

    /**
     * Binds the router to the H3 application using the provided bindRouter function.
     * 
     * @param app 
     */
    bindRouter (app: H3): void {
        this.options.bindRouter(app);
    }

    /**
     * Applies middleware to the H3 application.
     * 
     * @param app 
     * @param middleware 
     */
    applyMiddleware (app: H3, middleware: H3Middleware): void {
        app.use(
            Array.isArray(middleware) ? middleware[0] : middleware,
            Array.isArray(middleware) ? middleware[1] : undefined,
        );
    }

    /**
     * Starts the H3 server on the specified port.
     * 
     * @param app 
     * @param port 
     */
    start (app: H3, port: number): void {
        serve(app, { port });
    }
}
