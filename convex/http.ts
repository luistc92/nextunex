import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import { registerCamundaHttpActions } from "./externalAPI/camunda";

const http = httpRouter();


registerCamundaHttpActions(http);

// HTTP route for adding a task
http.route({
  path: "/addTask",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      // Parse the JSON body from the request
      const { text } = await request.json();

      // Validate that text is provided
      if (!text || typeof text !== 'string' || text.trim() === '') {
        return new Response(
          JSON.stringify({ error: "Task text is required and must be a non-empty string" }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*", // Allow CORS for development
              "Access-Control-Allow-Methods": "POST, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type",
            },
          }
        );
      }

      // Call the existing addTask mutation
      await ctx.runMutation(api.internalAPI.tasks.addTask, {
        text: text.trim(),
        type: "any",
        asignee: "http"
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

// Handle CORS preflight requests
http.route({
  path: "/addTask",
  method: "OPTIONS",
  handler: httpAction(async (_) => {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
      },
    });
  }),
});

// Export the router as default
export default http;