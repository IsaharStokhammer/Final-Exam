import express from "express";

import { remove, read, update, create } from "../controllers/crudController";

const router = express.Router();

router.route("/create").post(create);
router.route("/read/:id").get(read);
router.route("/update").put(update);
router.route("/delete/:id").delete(remove);


export default router;
