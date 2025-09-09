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

http.route({
  path: "/newRecorrido",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      // Parse the JSON body from the request
      const body = await request.json();
      console.log(body)

      const { origenRecorrido, destinoRecorrido, origenFlete, destinoFlete, cartaPorte, load, vacio, cliente, stops, tarifa, inicioSegMs, finalSegMs,  caja, unidad, operador } = body;

      const tramoRecorrido = await ctx.runMutation(api.internalAPI.tramos.findOrCreateTramo, {
        origen: origenRecorrido,
        destino: destinoRecorrido
      });
      console.log("tramo recorrido", tramoRecorrido, origenRecorrido, destinoRecorrido);

      const tramoFlete = await ctx.runMutation(api.internalAPI.tramos.findOrCreateTramo, {
        origen: origenFlete,
        destino: destinoFlete
      });

      console.log("tramo flete", tramoFlete, origenFlete, destinoFlete);

      const clienteDB = await ctx.runMutation(api.internalAPI.clientes.findOrCreateCliente, {
        name: cliente,
      });

      let stopsDB = [];

      if (stops == "NO") {
        
      }else{
        stopsDB = stops.split(",");
      }

      const flete = await ctx.runMutation(api.internalAPI.fletes.findOrCreateFlete, {
        cartaPorte: cartaPorte,
        load: load,
        vacio: vacio == "NO" ? false : true,
        cliente: clienteDB,
        stops: stopsDB,
        tarifa: tarifa,
        tramo: tramoFlete
      });

      console.log("flete", flete);

      const recorrido = await ctx.runMutation(api.internalAPI.recorridos.addRecorrido, {
        tramo: tramoRecorrido,
        inicio: inicioSegMs,
        fin: finalSegMs,
        flete: flete,
        caja: caja,
        unidad: unidad,
        operador: operador
      });

      return new Response(
        JSON.stringify({ sucess: true, message: "Flete created", statusCode: 200, flete, recorrido }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error creating flete:", error);

      return new Response(
        JSON.stringify({
          error: "Failed to create flete",
          details: error instanceof Error ? error.message : "Unknown error",
          statusCode: 500
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

http.route({
  path: "/deleteRecorrido",
  method: "DELETE",
  handler: httpAction(async (ctx, request) => {
    try {
      // Parse the JSON body from the request
      const body = await request.json();
      const { recorrido } = body;

      if (!recorrido) {
        return new Response(
          JSON.stringify({ error: "Recorrido ID is required in request body" }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      // Delete the recorrido
      await ctx.runMutation(api.internalAPI.recorridos.deleteRecorrido, {
        id: recorrido as any, // Cast to Id<"recorridos">
      });

      return new Response(
        JSON.stringify({
          success: true,
          message: "Recorrido deleted successfully",
          deletedId: recorrido
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error deleting recorrido:", error);

      return new Response(
        JSON.stringify({
          error: "Failed to delete recorrido",
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



http.route({
  path: "/getRecorridosAnteriores",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      // Parse the JSON body from the request
      const body = await request.json();
      console.log(body)

      const { unidad} = body;

      const recorridosAnteriores = await ctx.runQuery(api.internalAPI.recorridos.getRecorridosAnteriores, {
          unidad: unidad
      });

      return new Response(
        JSON.stringify({ sucess: true, message: "Got recorridos", statusCode: 200, recorridosAnteriores }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error getting recorridos:", error);

      return new Response(
        JSON.stringify({
          error: "Failed to get recorridos",
          details: error instanceof Error ? error.message : "Unknown error",
          statusCode: 500
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
