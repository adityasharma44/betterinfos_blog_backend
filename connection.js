// Mongo DB URL he yeh
//mongodb+srv://as7007731:dth3aPmeaX1ezF9D@blog.czhvtlb.mongodb.net/?retryWrites=true&w=majority&appName=blog

import mongoose from "mongoose";

export const connectDB = async () => {
  mongoose.connect(process.env.DBURL);
  const db = mongoose.connection;
  try {
    db.once("open", () => {
      console.log("Database Connected Successfully");
    });
  } catch (error) {
    db.on("error", () => {
      console.log("Error connecting Database");
    });
  }
};
