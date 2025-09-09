import { query } from "../_generated/server";
import { v } from "convex/values";


export const getData = query({
  args: { 
    reference: v.string(),
    variables: v.any()
   },
  handler: async (ctx, args) => {

    if (args.reference === "recorridosAnteriores") {
      return await ctx.db
        .query("recorridos")
        .withIndex("by_unidad", q => q.eq("unidad", args.variables.unidad))
        .order("desc")
        .take(2);
    }
  },
});