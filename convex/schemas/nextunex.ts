import { defineTable } from "convex/server";
import { v } from "convex/values";


export const taskFields = {
    // Camunda task properties
    camundaId: v.optional(v.string()),
    name: v.optional(v.string()),
    asignee: v.optional(v.string()),
    processInstanceId: v.optional(v.string()),
    businessKey: v.optional(v.string()),
    candidateUsers: v.optional(v.array(v.string())),
    candidateGroups: v.optional(v.array(v.string())),
    processDefinitionId: v.optional(v.string()),
    priority: v.optional(v.number()),
    formKey: v.optional(v.string()),
    formRef: v.optional(v.string()),
    taskDefinitionKey: v.optional(v.string()),
    variables: v.optional(v.any()),

    // Existing properties
    isCompleted: v.optional(v.boolean()),
    createdAt: v.optional(v.number()),
    permanent: v.optional(v.boolean())
}

export const nextunexSchema = {
  tasks: defineTable(taskFields),
};  