import { bindGracefulShutdown } from "@arcstack-hq/common";
import { Router } from "src/core/router";
import config from "src/config/middleware";
import path from "path";
import { prisma } from "src/core/database";
import ErrorHandler from "./utils/request-handlers";
import { ExpressDriver } from "@arcstack-hq/driver-express";
import { ArcstackKitDriver, ArcstackRouterAwareCore, ArcstackRouterContract, ArcstackRouteListOptions } from "@arcstack-hq/contract";
import { type Express, type Handler } from "express";

export default class Application implements ArcstackRouterAwareCore<Express, unknown> {
  private app: Express;
  private static app: Express;
  private driver: ArcstackKitDriver<Express, Handler>;

  /**
   * Creates an instance of the Application class, initializing 
   * the Express driver with the provided options and creating an Express 
   * application instance.
   * 
   * @param app 
   */
  constructor(app?: Express) {
    this.driver = new ExpressDriver({
      bindRouter: async (runtime) => {
        runtime.use(await Router.bind());
      },
      errorHandler: ErrorHandler,
    });
    this.app = app ?? this.driver.createApp();
    Application.app = this.app;
  }

  /**
   * Gets the Express application instance.
   * 
   * @returns 
   */
  getAppInstance () {
    return this.app;
  }

  /**
   * Gets the static Express application instance.
   * 
   * @returns 
   */
  static getAppInstance () {
    return Application.app;
  }

  /**
   * Gets the ArcstackKitDriver instance used by the application.
   * 
   * @returns 
   */
  getDriver () {
    return this.driver;
  }

  /**
   * Gets the ArcstackRouterContract implementation for the Express framework.
   * 
   * @returns 
   */
  getRouter (): ArcstackRouterContract<Express, unknown> {
    return {
      bind: (_app: Express) => Router.bind(),
      list: (options: ArcstackRouteListOptions = {}) => Router.list(options),
    };
  }

  /**
   * Boots the application by mounting public assets, binding the 
   * router, applying middleware, and starting the server.
   * 
   * @param port 
   */
  public async boot (port: number) {
    // Load public assets
    await this.driver.mountPublicAssets(this.app, path.join(process.cwd(), "public"));

    // Bind the router
    await this.driver.bindRouter(this.app);

    for (const middleware of config(this.app).global) {
      await this.driver.applyMiddleware(this.app, middleware);
    }

    // Error Handler
    await this.driver.registerErrorHandler?.(this.app);

    // Start the server
    await this.driver.start(this.app, port);

    // Handle graceful shutdown
    bindGracefulShutdown(async () => await this.shutdown());
  }

  /**
   * Shuts down the application by disconnecting from the database and exiting the process.
   */
  async shutdown () {
    await prisma.$disconnect();
    process.exit(0);
  }
}
