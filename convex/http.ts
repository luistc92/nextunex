import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import { registerCamundaHttpActions } from "./externalAPI/camunda";

const http = httpRouter();


registerCamundaHttpActions(http);

// Export the router as default
export default http;