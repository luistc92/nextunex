import { defineTable } from "convex/server";
import { v } from "convex/values";

export const nextunexSchema = {
  tasks: defineTable({
    type: v.union(v.literal("subirReporteMovimientos")),
    isCompleted: v.boolean(),
    createdAt: v.number(),
    asignee: v.optional(v.string()),
    data: v.optional(v.union(
      v.object({
        type: v.literal("subirReporteMovimientos"),
    })))
  }),
};  