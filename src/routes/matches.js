import { Router } from "express";
import { db } from "../db/db.js";
import { matches } from "../db/schema.js";
import { getMatchStatus } from "../utils/matches-status.js";
import {
  createMatchSchema,
  listMatchesQuerySchema,
} from "../validation/matches.js";
import { desc } from "drizzle-orm";

const MAX_LIMIT = 100;

const matchesRouter = Router();

matchesRouter
  .get("/", async (req, res) => {
    const parsedBody = listMatchesQuerySchema.safeParse(req.query);
    if (!parsedBody.success) {
      return res.status(400).json({
        error: "Query validation failed",
        details: parsedBody.error,
      });
    }

    const limit = Math.min(parsedBody.data.limit ?? 50, MAX_LIMIT);

    try {
      const events = await db
        .select()
        .from(matches)
        .orderBy(desc(matches.createdAt))
        .limit(limit);
      return res.status(200).json({ data: events });
    } catch (error) {
      console.error("Failed to fetch matches:", error);
      return res.status(500).json({ message: "Failed to fetch matches" });
    }
  })
  .post("/", async (req, res) => {
    const parsedBody = createMatchSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        error: "Payload validation failed",
        details: parsedBody.error.flatten(),
      });
    }

    const {
      startTime,
      endTime,
      homeScore = 0,
      awayScore = 0,
      ...matchData
    } = parsedBody.data;

    try {
      const [event] = await db
        .insert(matches)
        .values({
          ...matchData,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          homeScore,
          awayScore,
          status: getMatchStatus(startTime, endTime),
        })
        .returning();

      return res.status(201).json(event);
    } catch (error) {
      console.error("Failed to create match:", error);
      return res.status(500).json({ message: "Failed to create match" });
    }
  });

export default matchesRouter;
