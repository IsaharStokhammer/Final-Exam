import express from "express";
import { seedDatabaseRequest } from "../controllers/dbController";

const router = express.Router();
router.route("/createTerrorEventModel").get(seedDatabaseRequest);

export default router;
