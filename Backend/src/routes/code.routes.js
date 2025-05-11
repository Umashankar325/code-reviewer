import { Router } from "express";
import { executeCodeController } from "../controllers/code.controller.js";

const route = Router();
route.post("/execute", executeCodeController);

export default route;
