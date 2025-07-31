import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const moneySchema = {
  cortesDePeriodo: defineTable({
    createdAt: v.number(),
    unidad: v.id("unidades"),
    operador: v.id("operadores"),
    fechaInicio: v.number(),
    fechaFin: v.number(),
  }),
};