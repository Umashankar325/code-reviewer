import express, { urlencoded } from "express";
import projectRoutes from "./routes/project.routes.js";
import codeRoutes from "./routes/code.routes.js";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(
  {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  }
));

app.use("/project", projectRoutes);
app.use("/code", codeRoutes);

export default app;
