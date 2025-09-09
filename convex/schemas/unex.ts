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
  tramos: defineTable({
    name: v.string(),
    origen: v.string(),
    destino: v.string(),
    kms: v.number(),
  })
  .index("by_origen_destino", ["origen", "destino"]),
  recorridos: defineTable({
    tramo: v.id("tramos"),
    inicio: v.number(),
    fin: v.number(),
    flete: v.id("fletes"),
    caja: v.string(),
    unidad: v.string(),
    operador: v.string(),
  })
  .index("by_unidad", ["unidad"]),
  fletes: defineTable({
    cartaPorte: v.string(),
    load: v.string(),
    vacio: v.boolean(),
    cliente: v.id("clientes"),
    tramo: v.id("tramos"),
    stops: v.array(v.string()),
    tarifa: v.optional(v.number()),
  })
  .index("by_cartaPorte_load_tramo", ["cartaPorte", "load", "tramo"]),
  clientes: defineTable({
    name: v.string(),
    rfc: v.string(),
  })
  .index("by_rfc", ["rfc"])
  .index("by_name", ["name"]),
  evidencias: defineTable({
    flete: v.id("fletes"),
    file: v.string(),
  }).index("by_flete", ["flete"]),
  tarifas: defineTable({
    tramo: v.id("tramos"),
    cliente: v.id("clientes"),
    tarifa: v.number(),
  })
  .index("by_cliente_tramo", ["cliente", "tramo"])
};