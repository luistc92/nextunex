import { defineSchema } from "convex/server";
import { tasksSchema } from "./schemas/tasks";
import { unexSchema } from "./schemas/unex";


export default defineSchema({
  ...tasksSchema,
  ...unexSchema
});