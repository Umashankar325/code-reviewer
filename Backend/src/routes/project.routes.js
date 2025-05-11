import {Router} from "express"
import { createProjectController, getAllProjectController } from "../controllers/project.controller.js"
const route =Router()
route.post("/create",createProjectController)
route.get("/getAllProjects",getAllProjectController)
export default route