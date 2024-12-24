import express from "express";

import { remove, read, update, create } from "../controllers/crudController";

const router = express.Router();

router.route("/create").post(create);
router.route("/read").get(read);
router.route("/update").put(update);
router.route("/delete").delete(remove);

export default router;
