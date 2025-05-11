import mongoose, { Types } from "mongoose";
const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "project name is required"],
    },
    code: {
      type: String,
      default: "",
    },
    review: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
const projectModel = mongoose.model("projectModel", projectSchema);
export default projectModel;
