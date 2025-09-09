import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

export const addRecorrido = mutation({
  args: {
    tramo: v.id("tramos"),
    inicio: v.number(),
    fin: v.number(),
    flete: v.id("fletes"),
    caja: v.string(),
    unidad: v.string(),
    operador: v.string(),
  },
  handler: async (ctx, args) => {
    const recorridoId = await ctx.db.insert("recorridos", {
      tramo: args.tramo,
      inicio: args.inicio,
      fin: args.fin,
      flete: args.flete,
      caja: args.caja,
      unidad: args.unidad,
      operador: args.operador,
    });

    return recorridoId;
  },
});

// Mutation to add recorrido with origen/destino (creates tramo if needed)
// Note: This function duplicates tramo logic for backward compatibility
// Consider using api.internalAPI.tramos.findOrCreateTramo instead
export const addRecorridoWithOrigenDestino = mutation({
  args: {
    origen: v.string(),
    destino: v.string(),
    inicio: v.number(),
    fin: v.number(),
    flete: v.id("fletes"),
    caja: v.string(),
    unidad: v.string(),
    operador: v.string(),
    kms: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Find or create the tramo (duplicated logic from tramos.ts)
    const existingTramo = await ctx.db
      .query("tramos")
      .withIndex("by_origen_destino", (q) =>
        q.eq("origen", args.origen).eq("destino", args.destino)
      )
      .first();

    let tramoId;
    if (existingTramo) {
      tramoId = existingTramo._id;
    } else {
      // Create new tramo if not found
      const name = `${args.origen} - ${args.destino}`;
      tramoId = await ctx.db.insert("tramos", {
        name,
        origen: args.origen,
        destino: args.destino,
        kms: args.kms || 0,
      });
    }

    // Create the recorrido
    const recorridoId = await ctx.db.insert("recorridos", {
      tramo: tramoId,
      inicio: args.inicio,
      fin: args.fin,
      flete: args.flete,
      caja: args.caja,
      unidad: args.unidad,
      operador: args.operador,
    });

    return recorridoId;
  },
});

// Mutation to delete a recorrido
export const deleteRecorrido = mutation({
  args: {
    id: v.id("recorridos"),
  },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return { success: true };
  },
});

export const getRecorridosAnteriores = query({
  args: {
    unidad: v.string(),
  },
  handler: async (ctx, { unidad }) => {
    const recorridosAnteriores = await ctx.db
      .query("recorridos")
      .withIndex("by_unidad", (q) => q.eq("unidad", unidad))
      .order("desc")
      .take(2);

    // Populate each recorrido with tramo details (origen and destino)
    const recorridosConDetalles = await Promise.all(
      recorridosAnteriores.map(async (recorrido) => {
        const tramo = await ctx.db.get(recorrido.tramo);
        const flete = await ctx.db.get(recorrido.flete);

        return {
          ...recorrido,
          origen: tramo?.origen,
          destino: tramo?.destino,
          load: flete?.load,
          cartaPorte: flete?.cartaPorte,
        };
      })
    );

    console.log(recorridosConDetalles)

    return recorridosConDetalles;
  },
});
