import { defineTable } from "convex/server";
import { v } from "convex/values";


export const taskFields = {
    type: v.union(v.literal("subirReporteMovimientos")),
    isCompleted: v.optional(v.boolean()),
    createdAt: v.optional(v.number()),
    asignee: v.optional(v.string()),
    variables: v.optional(v.any())
}

export const nextunexSchema = {
  tasks: defineTable(taskFields),
};  