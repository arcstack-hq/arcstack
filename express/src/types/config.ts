import type { ArcstackMiddlewareConfig } from "@arcstack/contract";
import type { Handler } from "express";

export type MiddlewareConfig = ArcstackMiddlewareConfig<Handler>;
