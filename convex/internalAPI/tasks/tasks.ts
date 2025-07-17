import { query, mutation } from "../../_generated/server";
import { v } from "convex/values";

export const getTasks = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").order("desc").collect();
  },
});

export const addTask = mutation({
  args: { 
    type: v.union(v.literal("any"),v.literal("capturaDiesel")),
    asignee: v.string(),
    text: v.string(),
    data: v.optional(v.union(v.object({
        ejemplo: v.boolean(), 
      })))
   },
  handler: async (ctx, args) => {
    await ctx.db.insert("tasks", {
      text: args.text,
      isCompleted: false,
      createdAt: Date.now(),
      asignee: args.asignee,
      type: args.type,
      data: args.data
      
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