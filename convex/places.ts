import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Query to search places by name (for autocomplete)
export const searchPlaces = query({
  args: {
    searchTerm: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { searchTerm, limit = 10 }) => {
    if (!searchTerm.trim()) {
      return [];
    }

    // Search by name (case-insensitive)
    const places = await ctx.db
      .query("places")
      .withIndex("by_name")
      .filter((q) =>
        q.or(
          q.gte(q.field("name"), searchTerm),
          q.lte(q.field("name"), searchTerm + "\uffff")
        )
      )
      .take(limit);

    return places;
  },
});

// Query to get all places
export const getAllPlaces = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit = 50 }) => {
    return await ctx.db.query("places").take(limit);
  },
});

// Query to get a place by Google Place ID
export const getPlaceByPlaceId = query({
  args: {
    placeId: v.string(),
  },
  handler: async (ctx, { placeId }) => {
    return await ctx.db
      .query("places")
      .withIndex("by_place_id", (q) => q.eq("placeId", placeId))
      .first();
  },
});

// Mutation to create or update a place
export const upsertPlace = mutation({
  args: {
    name: v.string(),
    address: v.string(),
    placeId: v.string(),
    types: v.array(v.string()),
    location: v.object({
      lat: v.number(),
      lng: v.number(),
    }),
    formattedAddress: v.string(),
    vicinity: v.optional(v.string()),
    businessStatus: v.optional(v.string()),
    rating: v.optional(v.number()),
    userRatingsTotal: v.optional(v.number()),
    phoneNumber: v.optional(v.string()),
    website: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Check if place already exists
    const existingPlace = await ctx.db
      .query("places")
      .withIndex("by_place_id", (q) => q.eq("placeId", args.placeId))
      .first();

    if (existingPlace) {
      // Update existing place
      return await ctx.db.patch(existingPlace._id, {
        ...args,
        updatedAt: now,
      });
    } else {
      // Create new place
      return await ctx.db.insert("places", {
        ...args,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

// Mutation to delete a place
export const deletePlace = mutation({
  args: {
    id: v.id("places"),
  },
  handler: async (ctx, { id }) => {
    return await ctx.db.delete(id);
  },
});
