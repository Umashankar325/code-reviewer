// const app=require("./src/app")
import app from "./src/app.js";
import connect from "./src/db/db.js";
import { Socket, Server as soketServer } from "socket.io";
import http from "http";
import messageModel from "./src/models/message.model.js";
import { getReview } from "./src/services/ai.service.js";
import { log } from "console";
import projectModel from "./src/models/project.models.js";

connect();
const server = http.createServer(app);
const io = new soketServer(server, {
  cors: { origin: "*" },
});
io.on("connection", (socket) => {
  const project = socket.handshake.query.Project;
  socket.join(project);

  console.log("new client connected");
  socket.on("disconnect", () => {
    console.log("Client Disconnected");
  });

  socket.on("chat-history", async () => {
    const messages = await messageModel.find({ project: project });
    socket.emit("chat-history", messages);
  });

  socket.on("chat-message", async (message) => {

    socket.broadcast.to(project).emit("chat-res", message);
    await messageModel.create({
      project: project,
      text: message,
    });
  });
  socket.on("get-review", async (code) => {
    const review = await getReview(code);


    socket.emit("code-review", review);
        await projectModel.findByIdAndUpdate(project, {
      review: review,
    });
  });
  socket.on("code-change", async (code) => {


    socket.broadcast.to(project).emit("code-update", code);
    await projectModel.findByIdAndUpdate(project, {
      code: code,
    });
  });
});
server.listen(3000, () => {
  console.log("server is running on port number 3000");
});
