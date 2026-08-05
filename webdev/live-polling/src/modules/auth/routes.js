import Router from "express";
import app from "../../app.js";
import { createPollController, getPollController } from "./controllers.js";
import ApiResponse from "../../common/utils/api-res.js";

const router = Router();

router.get("/greet", (_, res) => {
  // res.send("Hello");
  return res.json(ApiResponse.ok("route is working"));

  console.log("hello");
});
router.post("/poll", createPollController);

router.get("/:id", getPollController);

export default router;
