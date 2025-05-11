import mongoose from "mongoose";
const messageSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "projectModel",
      required: [true, "Project is required"],
    },
    text: {
      type: String,
      required: [true, "message text is required"],
    },
  },
  { timestamps: true }
);
const messageModel = mongoose.model("messageModel", messageSchema);
export default messageModel;
