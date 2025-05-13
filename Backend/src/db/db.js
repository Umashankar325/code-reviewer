import mongoose from "mongoose";
import config from "../config/config.js";
const connect = async () => {
  try {
    // await mongoose.connect(config.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    // console.log(config.MONGODB_URI);
    

    console.log("db connected succsefully");
  } catch (error) {
    console.log(error.message);
  }
};
export default connect;
