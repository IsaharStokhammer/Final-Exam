import express, { Request, Response } from "express";
import { createResponse } from "../utils/utils";
import { seedDatabase } from "../services/dbSeedService";

export const seedDatabaseRequest = async (req: Request, res: Response) => {
      try {
        await seedDatabase();
        res.status(200).json(createResponse({}));
      } catch (error: any) {
        res.status(500).json(createResponse({ error: error.message }));
      }
};



  