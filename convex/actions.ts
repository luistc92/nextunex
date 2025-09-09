import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";



export const fetchCamundaFormSchema = action({
  args: { 
    camundaId: v.string(),
    variables: v.any()
  },
  handler: async (ctx, args) => {
    
      // Helper function to process components recursively and inject external data
  async function processComponentsForExternalData(components: any[]): Promise<void> {
    for (const component of components) {
      // Handle nested components (like groups)
      if (component.components && Array.isArray(component.components)) {
        await processComponentsForExternalData(component.components);
      }

      // Check if component has external data configuration
      if (component.properties && component.properties.externalData) {
        const reference = component.properties.externalData;

        try {
          console.log(`Fetching external data for component ${component.key} from ${reference}`);
          
            const data = await ctx.runQuery(api.internalAPI.externalQueries.getData, {
            reference: reference,
            variables:  args.variables
            });
            console.log("recorridos anteriores", data);
          
          

          // Handle different component types
          if (component.type === "select") {
            // For select components, map API response to field values
            component.values = data?.map((option: any) => ({
              value: option.id,
              label: option.name
            }));
            console.log(`Injected ${component.values.length} options into select component ${component.key}`);
          } else {
            //Nothing for now
          }

        } catch (error) {
          console.error(`Error fetching external data for component ${component.key}:`, error);
        }
      }
    }
  }
    try {
      // Construct Camunda REST API URL for form schema
      const url = `${process.env.CAMUNDA_BASE_URL}/engine-rest/task/${args.camundaId}/deployed-form`;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      const authToken = process.env.CAMUNDA_AUTH_TOKEN;

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
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

      // Process components to inject external data
      if (formSchema && formSchema.components) {
        console.log("Processing components for external data...");
        await processComponentsForExternalData(formSchema.components);
        console.log("Finished processing external data");
      }


      
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
    variables: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    console.log("aqui en complete", args.camundaId)
    try {
      // Construct Camunda REST API URL for completing task
      const url = `${process.env.CAMUNDA_BASE_URL}/engine-rest/task/${args.camundaId}/complete`;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      const authToken = process.env.CAMUNDA_AUTH_TOKEN;
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      // Prepare request body with variables
      const requestBody = {
        variables: args.variables || {},
        withVariablesInReturn: true
      };

      console.log(requestBody)

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        console.log(response)
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