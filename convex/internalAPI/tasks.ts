import { query, mutation } from "../_generated/server";
import { v } from "convex/values";
import {taskFields } from "../schemas/tasks";

export const getTasks = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").order("desc").collect();
  },
});


export const addTask = mutation({
  args: taskFields,
  handler: async (ctx, args) => {
    await ctx.db.insert("tasks", {
      // Camunda task properties
      camundaId: args.camundaId,
      name: args.name,
      asignee: args.asignee,
      processInstanceId: args.processInstanceId,
      businessKey: args.businessKey,
      candidateUsers: args.candidateUsers,
      candidateGroups: args.candidateGroups,
      processDefinitionId: args.processDefinitionId,
      priority: args.priority,
      formKey: args.formKey,
      formRef: args.formRef,
      taskDefinitionKey: args.taskDefinitionKey,
      variables: args.variables,

      // System properties
      isCompleted: args.isCompleted ?? false,
      createdAt: args.createdAt ?? Date.now(),
      permanent: args.permanent ?? false
    });
  },
});

export const toggleTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (task) {
      await ctx.db.patch(args.id, { isCompleted: !task.isCompleted });
    }
  },
});

export const deleteTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});



