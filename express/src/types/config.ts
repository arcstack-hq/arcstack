import type { ArcstackMiddlewareConfig } from "@arcstack-hq/contract";
import type { Handler } from "express";

export type MiddlewareConfig = ArcstackMiddlewareConfig<Handler>;
