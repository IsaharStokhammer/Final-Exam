import express from "express";
import {
} from "../controllers/dbController";
import { getDeadliestAttackTypes, getHighestCasualtyRegions } from "../controllers/qweryController";

const router = express.Router();

router.route("/deadliest-attack-types").get(getDeadliestAttackTypes);
router.route("/highest-casualty-regions").get(getHighestCasualtyRegions);
// router.get('/highest-casualty-regions').get(getHighestCasualtyRegions);

export default router;
