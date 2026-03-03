import express, { type ErrorRequestHandler, type Express, type Handler } from "express";

import { ArcstackKitDriver } from "@arcstack/contract";

export interface ExpressDriverOptions {
    bindRouter: (app: Express) => void;
    errorHandler?: ErrorRequestHandler | Handler;
}

/**
 * The ExpressDriver class implements the ArcstackKitDriver 
 * contract for the Express framework.
 */
export class ExpressDriver extends ArcstackKitDriver<Express, Handler> {
    readonly name = "express";
    private readonly options: ExpressDriverOptions;

    /**
     * Creates an instance of ExpressDriver.
     * 
     * @param options 
     */
    constructor(options: ExpressDriverOptions) {
        super();
        this.options = options;
    }

    /**
     * Creates an Express application instance.
     * 
     * @returns 
     */
    createApp (): Express {
        return express();
    }

    /**
     * Mounts static assets from the specified public path to the Express application.
     * 
     * @param app 
     * @param publicPath 
     */
    mountPublicAssets (app: Express, publicPath: string): void {
        app.use(express.static(publicPath));
    }

    /**
     * Binds the router to the Express application using the provided bindRouter function.
     * 
     * @param app 
     */
    bindRouter (app: Express): void {
        this.options.bindRouter(app);
    }

    /**
     * Applies middleware to the Express application.
     * 
     * @param app 
     * @param middleware 
     */
    applyMiddleware (app: Express, middleware: Handler): void {
        app.use(middleware);
    }

    /**
     * Registers an error handler middleware to the Express 
     * application if provided in the options.
     * 
     * @param app 
     */
    registerErrorHandler (app: Express): void {
        if (this.options.errorHandler) {
            app.use(this.options.errorHandler as ErrorRequestHandler);
        }
    }

    /**
     * Starts the Express server on the specified port.
     * 
     * @param app 
     * @param port 
     */
    start (app: Express, port: number): void {
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    }
}
