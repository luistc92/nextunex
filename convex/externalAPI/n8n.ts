import type { HttpRouter } from "convex/server";
import { httpAction } from "../_generated/server";
import { api } from "../_generated/api";

export const registerN8NHttpActions = (http: HttpRouter) => {
    // HTTP route for adding a task
http.route({
  path: "/generarEdodeResultadosPorCarro",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {

      const body = await request.json();
      const text = body.text;
      // Call the existing addTask mutation
      await ctx.runMutation(api.internalAPI.tasks.addTask, {
        text: text.trim(),
      });

      // Return success response
      return new Response(
        JSON.stringify({
          success: true,
          message: "Task added successfully",
          task: { text: text.trim() }
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
          error: "Failed to add task",
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




