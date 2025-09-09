import { mutation, query } from "../_generated/server";
import { v } from "convex/values";


// Query to get all fletes
export const getAllFletes = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit = 50 }) => {
    return await ctx.db.query("fletes").order("desc").take(limit);
  },
});

// Mutation to create a new flete
export const addFlete = mutation({
  args: {
    cartaPorte: v.string(),
    load: v.string(),
    vacio: v.boolean(),
    cliente: v.id("clientes"),
    tramo: v.id("tramos"),
    stops: v.array(v.string()),
    tarifa: v.number(),
  },
  handler: async (ctx, args) => {
    const fleteId = await ctx.db.insert("fletes", {
      cartaPorte: args.cartaPorte,
      load: args.load,
      vacio: args.vacio,
      cliente: args.cliente,
      tramo: args.tramo,
      stops: args.stops,
      tarifa: args.tarifa,
    });

    return fleteId;
  },
});

// Mutation to find or create a flete
export const findOrCreateFlete = mutation({
  args: {
    cartaPorte: v.string(),
    load: v.string(),
    vacio: v.boolean(),
    cliente: v.id("clientes"),
    tramo: v.id("tramos"),
    stops: v.array(v.string()),
    tarifa: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // First try to find existing flete using the index by_cartaPorte_load_tramo
    const existingFlete = await ctx.db
      .query("fletes")
      .withIndex("by_cartaPorte_load_tramo", (q) =>
        q.eq("cartaPorte", args.cartaPorte)
         .eq("load", args.load)
         .eq("tramo", args.tramo)
      )
      .first();

    if (existingFlete) {
      return existingFlete._id;
    }

    // Create new flete if not found
    const fleteId = await ctx.db.insert("fletes", {
      cartaPorte: args.cartaPorte,
      load: args.load,
      vacio: args.vacio,
      cliente: args.cliente,
      tramo: args.tramo,
      stops: args.stops,
      tarifa: args.tarifa,
    });

    return fleteId;
  },
});

// Mutation to update a flete
export const updateFlete = mutation({
  args: {
    id: v.id("fletes"),
    cartaPorte: v.optional(v.string()),
    load: v.optional(v.string()),
    vacio: v.optional(v.boolean()),
    cliente: v.optional(v.id("clientes")),
    tramo: v.optional(v.id("tramos")),
    stops: v.optional(v.array(v.string())),
    tarifa: v.optional(v.number()),
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

// Mutation to delete a flete
export const deleteFlete = mutation({
  args: {
    id: v.id("fletes"),
  },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return { success: true };
  },
});