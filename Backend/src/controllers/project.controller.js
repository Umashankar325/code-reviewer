import projectModel from "../models/project.models.js";
import { createProject } from "../services/project.service.js";

export async function createProjectController(req, res) {
  const { projectName } = req.body;
  const newProject = await createProject(projectName);

  res.status(201).json({ status: "sucsses", data: newProject });
}

export async function getAllProjectController(req, res) {
  try {
    const allprojects = await projectModel.find();
    res.status(200).json({ status: "sucsses", data: allprojects });
  } catch (error) {
    console.log(error.message);
  }
}
