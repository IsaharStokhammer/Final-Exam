import express from "express";
import {
} from "../controllers/dbController";
import { getDeadliestAttackTypes, getHighestCasualtyRegions, getTrendsForYears, getTopGroups as getTopGroups, getGroupsByYear } from "../controllers/qweryController";

const router = express.Router();

router.route("/deadliest-attack-types").get(getDeadliestAttackTypes);
router.route("/highest-casualty-regions").get(getHighestCasualtyRegions);
router.route("/incident-trends/:startYear/:endYear").get(getTrendsForYears);
router.route("/top-groups").get(getTopGroups);
router.route("/relationships/top-groups/:region").get(getTopGroups);
router.route("/relationships/groups-by-year/:year").get(getGroupsByYear);


// router.get('/highest-casualty-regions').get(getHighestCasualtyRegions);

export default router;
