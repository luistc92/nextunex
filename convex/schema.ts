import { defineSchema } from "convex/server";
import { operadoresSchema } from "./schemas/operadoresunex";
import { nextunexSchema } from "./schemas/nextunex";


export default defineSchema({
  ...operadoresSchema,
  ...nextunexSchema
});