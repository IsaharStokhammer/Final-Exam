import express from "express";
import {
} from "../controllers/dbController";
import { getDeadliestAttackTypes } from "../controllers/qweryController";

const router = express.Router();

router.route("/deadliest-attack-types").get(getDeadliestAttackTypes);

export default router;
