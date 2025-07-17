import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const operadoresSchema = {

  reembolsos: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
    createdAt: v.number(),
    asignee: v.string(),
    type: v.union(v.literal("any"),v.literal("capturaDiesel")),
    data: v.optional(v.union(v.object({
        ejemplo: v.boolean(), 
      })))
  }),
  
};