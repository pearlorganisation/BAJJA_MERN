import express from "express";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/configs/swaggerConfig.js";
import { errorHandler } from "./src/middleware/errorHandler.js";

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("uploads"));

//Routes Imports
import authRouter from "./src/routes/auth/authRoutes.js";
import productPostRouter from "./src/routes/product/productRoutes.js";
import googleAuthRouter from "./src/routes/googleAuth/googleAuthRoutes.js";
import homeRouter from "./src/routes/home/homeRoutes.js";
import userRouter from "./src/routes/user/userRoutes.js";
import categoryRouter from "./src/routes/category/categoryRoutes.js";
import chatRoomRouter from "./src/routes/chatRoom/chatRoom.js";

// Routes Declaration
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/googleAuth", googleAuthRouter);
app.use("/api/v1/product-posts", productPostRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/home", homeRouter);
app.use("/api/v1/chat-room", chatRoomRouter);

app.use(errorHandler);
app.use("*", (req, res) => {
  res.status(404).json({ status: false, message: "Route not found" });
});

export { app };
