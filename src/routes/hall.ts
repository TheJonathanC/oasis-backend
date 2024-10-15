import { Router } from "express";
const router = Router();
import { addHallCtrl, deleteHall } from "../controllers/hallController.ts";

router.post("/addHall", addHallCtrl);

router.delete("/deleteHall", deleteHall);

export default router;
