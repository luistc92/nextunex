import type { HttpRouter } from "convex/server";
import { httpAction } from "../_generated/server";
import { api } from "../_generated/api";

export const registerCamundaHttpActions = (http: HttpRouter) => {
    // HTTP route for adding a task
http.route({
  path: "/createTask",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      // Parse the JSON body from the request

      const body = await request.json();
      console.log(body)

      const { type, variables } = body;

      // Validate that type is provided
      if (!type || type !== 'subirReporteMovimientos' || type.trim() === '') {
        return new Response(
          JSON.stringify({ error: "Task type is rnot subirReporteMovimientos" }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "POST, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type",
            },
          }
        );
      }

      // Call the existing addTask mutation
      await ctx.runMutation(api.internalAPI.tasks.addTask, {
        type: type as "subirReporteMovimientos",
        isCompleted: false,
        createdAt: Date.now(),
        asignee: "camunda",
        variables: variables,
      });

      // Return success response
      return new Response(
        JSON.stringify({
          success: true,
          message: "Task added successfully",
          task: { type: type, variables: variables }
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




