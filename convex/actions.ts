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
