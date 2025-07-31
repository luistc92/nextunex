import type { HttpRouter } from "convex/server";
import { httpAction } from "../_generated/server";
import { api } from "../_generated/api";

export const registerCamundaHttpActions = (http: HttpRouter) => {
    // HTTP route for adding a task
http.route({
  path: "/hola",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {

      const body = await request.json();
      const name = body.name;
    
      return new Response(
        JSON.stringify({
          success: true,
          message: `Hola ${name}`,
          name:  `${name} Morales` 
        }),
        {
          status: 201,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*", // Allow CORS for development
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }
      );
    } catch (error) {
      console.error("Error adding task:", error);

      return new Response(
        JSON.stringify({
          error: "Error Rafa",
          details: error instanceof Error ? error.message : "Unknown error"
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*", // Allow CORS for development
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }
      );
    }
  }),
});
}




