/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as actions from "../actions.js";
import type * as externalAPI_camunda from "../externalAPI/camunda.js";
import type * as externalAPI_n8n from "../externalAPI/n8n.js";
import type * as http from "../http.js";
import type * as internalAPI_reembolsos from "../internalAPI/reembolsos.js";
import type * as internalAPI_tasks from "../internalAPI/tasks.js";
import type * as schemas_money from "../schemas/money.js";
import type * as schemas_nextunex from "../schemas/nextunex.js";
import type * as schemas_operadoresunex from "../schemas/operadoresunex.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  actions: typeof actions;
  "externalAPI/camunda": typeof externalAPI_camunda;
  "externalAPI/n8n": typeof externalAPI_n8n;
  http: typeof http;
  "internalAPI/reembolsos": typeof internalAPI_reembolsos;
  "internalAPI/tasks": typeof internalAPI_tasks;
  "schemas/money": typeof schemas_money;
  "schemas/nextunex": typeof schemas_nextunex;
  "schemas/operadoresunex": typeof schemas_operadoresunex;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
