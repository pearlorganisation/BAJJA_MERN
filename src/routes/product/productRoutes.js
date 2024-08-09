import express from "express";

const router = express.Router();

router.route("/postAdd").post(createPost);

export default router;
