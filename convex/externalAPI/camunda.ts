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

      const { id, name, asignee, variables, processInstanceId, businessKey, candidateUsers, candidateGroups, processDefinitionId, eventName, priority, formKey, formRef, taskDefinitionKey } = body;
      

      
      if(eventName != "create"){
        return new Response(
          JSON.stringify({ sucess: true, message: `Event ${eventName} received, nothing created` }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }


      if (!id || id.trim() === '') {
        return new Response(
          JSON.stringify({ error: "Id is not present or is Empty" }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      // Call the existing addTask mutation with all Camunda fields
      await ctx.runMutation(api.internalAPI.tasks.addTask, {
        // Camunda task properties
        camundaId: id,
        name: name,
        asignee: asignee,
        processInstanceId: processInstanceId,
        businessKey: businessKey,
        candidateUsers: candidateUsers,
        candidateGroups: candidateGroups,
        processDefinitionId: processDefinitionId,
        priority: priority,
        formKey: formKey,
        formRef: formRef,
        taskDefinitionKey: taskDefinitionKey,
        variables: variables,

        // System properties
        isCompleted: false,
        createdAt: Date.now(),
        permanent: false
      });

      // Return success response
      return new Response(
        JSON.stringify({
          success: true,
          message: "Task added successfully",
          task: {
            camundaId: id,
            name: name,
            taskDefinitionKey: taskDefinitionKey,
            variables: variables
          }
        }),
        {
          status: 201,
          headers: {
            "Content-Type": "application/json",
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
          },
        }
      );
    }
  }),
});
}




