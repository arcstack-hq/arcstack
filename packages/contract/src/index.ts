export type PromiseOrValue<T> = T | Promise<T>;

export interface ArcstackMiddlewareConfig<TMiddleware> {
  global: TMiddleware[];
  before: TMiddleware[];
  after: TMiddleware[];
}

/**
 * The ArcstackKitDriver class defines the contract for a driver 
 * that can be used with the ArcstackKitContract. 
 */
export abstract class ArcstackKitDriver<TApp, TMiddleware> {
  abstract readonly name: string;
  abstract createApp (): TApp;
  abstract mountPublicAssets (app: TApp, publicPath: string): PromiseOrValue<void>;
  abstract bindRouter (app: TApp): PromiseOrValue<void>;
  abstract applyMiddleware (app: TApp, middleware: TMiddleware): PromiseOrValue<void>;
  registerErrorHandler (_app: TApp): PromiseOrValue<void> {
    return;
  }
  abstract start (app: TApp, port: number): PromiseOrValue<void>;
}

/**
 * The ArcstackKitContract class defines the contract for an 
 * application that uses the ArcstackKitDriver.
 */
export abstract class ArcstackKitContract<TApp, TMiddleware> {
  abstract app: TApp;
  abstract driver: ArcstackKitDriver<TApp, TMiddleware>;
  abstract middleware: ArcstackMiddlewareConfig<TMiddleware>;
  abstract boot (port: number): Promise<void>;
  abstract shutdown (): Promise<void>;
}
