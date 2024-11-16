import express from "express";
import { connectDB } from "./connection.js";
import { configDotenv } from "dotenv";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler.js";
import userAuthRoutes from "./routes/auth.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import commentRoutes from "./routes/comment.routes.js"
import contactRoutes from "./routes/contact.routes.js";
import morgan from "morgan";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

const app = express();

// get path of the current file stored
global.appRoot = dirname(fileURLToPath(import.meta.url));

configDotenv();
connectDB();

// serve images stored in uploads folder when a request is made on upload directory 
app.use("/uploads",express.static(path.join(appRoot,"/uploads")));

// Allow other resources to access and use API's
const corsOptions = {
  origin: "*",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use("/auth", userAuthRoutes);
app.use("/blogs", blogRoutes);
app.use("/comments",commentRoutes)
app.use("/contact",contactRoutes)
app.use(errorHandler);
app.listen(process.env.PORT, () => {
  console.log(`Server Started Succesfully at ${process.env.PORT}`);
});
