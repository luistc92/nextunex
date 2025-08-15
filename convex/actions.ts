import { action } from "./_generated/server";
import { v } from "convex/values";

export const fetchCamundaFormSchema = action({
  args: { 
    camundaId: v.string(),
    camundaBaseUrl: v.string(),
    authToken: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    try {
      // Construct Camunda REST API URL for form schema
      const url = `${args.camundaBaseUrl}/engine-rest/task/${args.camundaId}/deployed-form`;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (args.authToken) {
        headers['Authorization'] = `Bearer ${args.authToken}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        console.log(response)
        throw new Error(`Camunda API error! status: ${response.status}`);
      }

      const formSchema = await response.json();
      
      return {
        success: true,
        data: formSchema,
        error: null
      };
    } catch (error) {
      console.error('Error fetching Camunda form schema:', error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch Camunda form schema'
      };
    }
  },
});

export const completeCamundaTask = action({
  args: {
    camundaId: v.string(),
    camundaBaseUrl: v.string(),
    authToken: v.optional(v.string()),
    variables: v.optional(v.any())
  },
  handler: async (ctx, args) => {
    try {
      // Construct Camunda REST API URL for completing task
      const url = `${args.camundaBaseUrl}/engine-rest/task/${args.camundaId}/complete`;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (args.authToken) {
        headers['Authorization'] = `Bearer ${args.authToken}`;
      }

      // Prepare request body with variables
      const requestBody = {
        variables: args.variables || {},
        withVariablesInReturn: true
      };

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Camunda API error! status: ${response.status}`);
      }

      // Task completion returns 204 No Content on success
      return {
        success: true,
        data: { message: 'Task completed successfully' },
        error: null
      };
    } catch (error) {
      console.error('Error completing Camunda task:', error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Failed to complete Camunda task'
      };
    }
  },
});