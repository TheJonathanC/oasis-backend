import { Router } from "express";
const router = Router();
import {
  addHallCtrl,
  deleteHall,
  updateHallEntry,
} from "../controllers/hallController.ts";

router.post("/addHall", addHallCtrl); //needs role auth

router.delete("/deleteHall", deleteHall); //needs role auth

router.patch("/update", updateHallEntry);
export default router;
