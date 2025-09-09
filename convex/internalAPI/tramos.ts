import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

// Query to find a tramo by origen and destino
export const findTramoByOrigenDestino = query({
  args: {
    origen: v.string(),
    destino: v.string(),
  },
  handler: async (ctx, { origen, destino }) => {
    return await ctx.db
      .query("tramos")
      .withIndex("by_origen_destino", (q) =>
        q.eq("origen", origen).eq("destino", destino)
      )
      .first();
  },
});

// Query to get all tramos
export const getAllTramos = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit = 50 }) => {
    return await ctx.db.query("tramos").order("desc").take(limit);
  },
});

// Mutation to create a new tramo
export const addTramo = mutation({
  args: {
    name: v.string(),
    origen: v.string(),
    destino: v.string(),
    kms: v.number(),
  },
  handler: async (ctx, args) => {
    const tramoId = await ctx.db.insert("tramos", {
      name: args.name,
      origen: args.origen,
      destino: args.destino,
      kms: args.kms,
    });

    return tramoId;
  },
});

// Mutation to find or create a tramo
export const findOrCreateTramo = mutation({
  args: {
    origen: v.string(),
    destino: v.string(),
    kms: v.optional(v.number()),
  },
  handler: async (ctx, { origen, destino, kms = 0 }) => {
    // First try to find existing tramo
    const existingTramo = await ctx.db
      .query("tramos")
      .withIndex("by_origen_destino", (q) =>
        q.eq("origen", origen).eq("destino", destino)
      )
      .first();

    if (existingTramo) {
      return existingTramo._id;
    }

    // Create new tramo if not found
    const name = `${origen} - ${destino}`;
    const tramoId = await ctx.db.insert("tramos", {
      name,
      origen,
      destino,
      kms,
    });

    return tramoId;
  },
});

// Mutation to update a tramo
export const updateTramo = mutation({
  args: {
    id: v.id("tramos"),
    name: v.optional(v.string()),
    origen: v.optional(v.string()),
    destino: v.optional(v.string()),
    kms: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...updates }) => {
    // Remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    if (Object.keys(cleanUpdates).length === 0) {
      throw new Error("No updates provided");
    }

    await ctx.db.patch(id, cleanUpdates);
    return await ctx.db.get(id);
  },
});

// Mutation to delete a tramo
export const deleteTramo = mutation({
  args: {
    id: v.id("tramos"),
  },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return { success: true };
  },
});