import { defineTable } from "convex/server";
import { v } from "convex/values";


export const unexSchema = {
  places: defineTable({
    // Basic place information
    name: v.string(),
    address: v.string(),

    // Google Places API data
    placeId: v.string(),
    types: v.array(v.string()),

    // Geographic data
    location: v.object({
      lat: v.number(),
      lng: v.number(),
    }),

    // Additional details
    formattedAddress: v.string(),
    vicinity: v.optional(v.string()),

    // Business information (optional)
    businessStatus: v.optional(v.string()),
    rating: v.optional(v.number()),
    userRatingsTotal: v.optional(v.number()),

    // Contact information (optional)
    phoneNumber: v.optional(v.string()),
    website: v.optional(v.string()),

    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_place_id", ["placeId"])
    .index("by_name", ["name"])
    .index("by_types", ["types"]),
};