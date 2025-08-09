import { query, mutation } from "../_generated/server";
import { v } from "convex/values";
import {taskFields } from "../schemas/nextunex";

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
      isCompleted: false,
      createdAt: Date.now(),
      asignee: args.asignee || "general",
      type: args.type || "any",
      variables: args.variables

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

export const createTestTask = mutation({
  args: {},
  handler: async (ctx) => {
    await ctx.db.insert("tasks", {
      type: "subirReporteMovimientos",
      isCompleted: false,
      createdAt: Date.now(),
      asignee: "system",
      variables: {
        type: "subirReporteMovimientos",
        testData: "This is a test task"
      }
    });
  },
});