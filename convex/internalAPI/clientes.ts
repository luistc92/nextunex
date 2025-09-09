import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

// Query to find a cliente by RFC
export const findClienteByRfc = query({
  args: {
    rfc: v.string(),
  },
  handler: async (ctx, { rfc }) => {
    return await ctx.db
      .query("clientes")
      .withIndex("by_rfc", (q) => q.eq("rfc", rfc))
      .first();
  },
});

// Query to find a cliente by name
export const findClienteByName = query({
  args: {
    name: v.string(),
  },
  handler: async (ctx, { name }) => {
    return await ctx.db
      .query("clientes")
      .withIndex("by_name", (q) => q.eq("name", name))
      .first();
  },
});

// Query to get all clientes
export const getAllClientes = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit = 50 }) => {
    return await ctx.db.query("clientes").order("desc").take(limit);
  },
});

// Mutation to create a new cliente
export const addCliente = mutation({
  args: {
    name: v.string(),
    rfc: v.string(),
  },
  handler: async (ctx, args) => {
    const clienteId = await ctx.db.insert("clientes", {
      name: args.name,
      rfc: args.rfc,
    });

    return clienteId;
  },
});

// Mutation to find or create a cliente by name
export const findOrCreateCliente = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // First try to find existing cliente by name
    const existingCliente = await ctx.db
      .query("clientes")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();

    if (existingCliente) {
      return existingCliente._id;
    }

    // Create new cliente if not found
    const clienteId = await ctx.db.insert("clientes", {
      name: args.name,
      rfc: "",
    });

    return clienteId;
  },
});

// Mutation to update a cliente
export const updateCliente = mutation({
  args: {
    id: v.id("clientes"),
    name: v.optional(v.string()),
    rfc: v.optional(v.string()),
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

// Mutation to delete a cliente
export const deleteCliente = mutation({
  args: {
    id: v.id("clientes"),
  },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return { success: true };
  },
});