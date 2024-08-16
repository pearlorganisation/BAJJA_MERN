import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/configs/swaggerConfig.js";
import authRouter from "./src/routes/auth/authRoutes.js";
import productPostRouter from "./src/routes/product/productRoutes.js";
import googleAuthRouter from "./src/routes/googleAuth/googleAuthRoutes.js";
import homeRouter from "./src/routes/home/homeRoutes.js";
import userRouter from "./src/routes/user/userRoutes.js";
import { error } from "./src/middleware/error.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8000;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/productPost", productPostRouter);
app.use("/api/v1/googleAuth", googleAuthRouter);
app.use("/api/v1/home", homeRouter);

app.use(error);

app.listen(PORT, () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.log(error));
  console.log(`Server is running on http://localhost:${PORT}`);
});
