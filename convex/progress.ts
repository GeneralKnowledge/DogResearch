import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listForUser = query({
  args: { anonymousUserId: v.string() },
  returns: v.array(
    v.object({
      lessonId: v.string(),
      stepNumber: v.number(),
      completed: v.boolean()
    })
  ),
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("lessonProgress")
      .withIndex("by_user", (q) => q.eq("anonymousUserId", args.anonymousUserId))
      .collect();
    return rows.map((r) => ({
      lessonId: r.lessonId,
      stepNumber: r.stepNumber,
      completed: r.completed
    }));
  }
});

export const setStep = mutation({
  args: {
    anonymousUserId: v.string(),
    lessonId: v.string(),
    stepNumber: v.number(),
    completed: v.boolean()
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("lessonProgress")
      .withIndex("by_user_and_lesson", (q) =>
        q.eq("anonymousUserId", args.anonymousUserId).eq("lessonId", args.lessonId)
      )
      .collect();

    const match = existing.find((r) => r.stepNumber === args.stepNumber);
    const updatedAt = Date.now();

    if (match) {
      await ctx.db.patch(match._id, {
        completed: args.completed,
        updatedAt
      });
    } else {
      await ctx.db.insert("lessonProgress", {
        anonymousUserId: args.anonymousUserId,
        lessonId: args.lessonId,
        stepNumber: args.stepNumber,
        completed: args.completed,
        updatedAt
      });
    }
    return null;
  }
});

export const listMetricsForUser = query({
  args: { anonymousUserId: v.string() },
  returns: v.array(
    v.object({
      metricId: v.string(),
      completed: v.boolean()
    })
  ),
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("metricProgress")
      .withIndex("by_user", (q) => q.eq("anonymousUserId", args.anonymousUserId))
      .collect();
    return rows.map((r) => ({ metricId: r.metricId, completed: r.completed }));
  }
});

export const setMetric = mutation({
  args: {
    anonymousUserId: v.string(),
    metricId: v.string(),
    completed: v.boolean()
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("metricProgress")
      .withIndex("by_user_and_metric", (q) =>
        q.eq("anonymousUserId", args.anonymousUserId).eq("metricId", args.metricId)
      )
      .unique();

    const updatedAt = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, { completed: args.completed, updatedAt });
    } else {
      await ctx.db.insert("metricProgress", {
        anonymousUserId: args.anonymousUserId,
        metricId: args.metricId,
        completed: args.completed,
        updatedAt
      });
    }
    return null;
  }
});
