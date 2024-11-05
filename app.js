import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/configs/swaggerConfig.js";
import { errorHandler } from "./src/middleware/errorHandler.js";

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());
app.use(
  cors({
    origin: "*", // Allow requests from any origin
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Specify allowed methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("uploads"));
app.use(morgan("dev"));

//Routes Imports
import authRouter from "./src/routes/auth/authRoutes.js";
import productPostRouter from "./src/routes/product/productRoutes.js";
import googleAuthRouter from "./src/routes/googleAuth/googleAuthRoutes.js";
import homeRouter from "./src/routes/home/homeRoutes.js";
import userRouter from "./src/routes/user/userRoutes.js";
import categoryRouter from "./src/routes/category/categoryRoutes.js";
import chatRoomRouter from "./src/routes/chatRoom/chatRoom.js";
import commentRouter from "./src/routes/comment/commentRoutes.js";
import favouriteRouter from "./src/routes/favourite/favouriteRoutes.js";
import notificationRouter from "./src/routes/notification/notificationRoutes.js";

// Routes Declaration
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/googleAuth", googleAuthRouter);
app.use("/api/v1/product-posts", productPostRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/home", homeRouter);
app.use("/api/v1/chat-room", chatRoomRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/favourites", favouriteRouter);
app.use("/api/v1/notification", notificationRouter);

app.use(errorHandler);
app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

export { app };
