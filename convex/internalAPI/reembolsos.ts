import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

export const getReembolsos = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").order("desc").collect();
  },
});

