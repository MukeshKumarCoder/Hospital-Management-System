import mongoose from "mongoose";

export const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("DB connected Successfully");
  } catch (error) {
    console.error("DB Connection Failed", error);
    process.exit(1)
  }
};
