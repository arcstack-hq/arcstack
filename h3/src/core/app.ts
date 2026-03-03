import { bindGracefulShutdown } from "@arcstack/common";

import config from "src/config/middleware";
import { prisma } from "src/core/database";
import { ArcstackKitDriver, ArcstackRouterAwareCore, ArcstackRouterContract, ArcstackRouteListOptions } from "@arcstack/contract";
import { H3Driver, type H3Middleware } from "@arcstack/driver-h3";
import { H3 } from "h3";
import { Router } from "src/core/router";
import ErrorHandler from "./utils/request-handlers";
import { staticAssetHandler } from "./middlewares/staticAssetHandler";

export default class Application implements ArcstackRouterAwareCore<H3, unknown> {
  private app: H3;
  private static app: H3;
  private driver: ArcstackKitDriver<H3, H3Middleware>;

  /**
   * Creates an instance of the Application class, initializing 
   * the H3 driver with the provided options and creating an H3 application instance.
   * 
   * @param app 
   */
  constructor(app?: H3) {
    this.driver = new H3Driver({
      createApp: () =>
        new H3({
          onError: ErrorHandler,
        }),
      bindRouter: async (runtime) => {
        await Router.bind(runtime);
      },
      mountPublicAssets: (runtime) => {
        runtime.use(staticAssetHandler());
      },
    });

    this.app = app ?? this.driver.createApp();

    Application.app = this.app;
  }

  /**
   * Gets the H3 application instance.
   * 
   * @returns 
   */
  getAppInstance () {
    return this.app;
  }

  /**
   * Gets the static H3 application instance.
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
   * Gets the ArcstackRouterContract implementation for the H3 framework.
   * 
   * @returns 
   */
  getRouter (): ArcstackRouterContract<H3, unknown> {
    return {
      bind: (app: H3) => Router.bind(app),
      list: (options: ArcstackRouteListOptions = {}, app?: H3) => Router.list(options, app ?? this.app),
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
    await this.driver.mountPublicAssets(this.app, "public");

    // Bind the router
    await this.driver.bindRouter(this.app);

    for (const middleware of config(this.app).global) {
      await this.driver.applyMiddleware(this.app, middleware);
    }

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
