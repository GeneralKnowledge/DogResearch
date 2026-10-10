import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  lessonProgress: defineTable({
    anonymousUserId: v.string(),
    lessonId: v.string(),
    stepNumber: v.number(),
    completed: v.boolean(),
    updatedAt: v.number()
  })
    .index("by_user_and_lesson", ["anonymousUserId", "lessonId"])
    .index("by_user", ["anonymousUserId"])
});
