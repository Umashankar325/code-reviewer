import projectModel from "../models/project.models.js";

export async function createProject(projectName) {
  const project=await projectModel.create({name:projectName})
  return project
 }
 