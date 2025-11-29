import express from "express";
import "dotenv/config";
import cors from "cors";
import { errors } from "celebrate";
import cookieParser from "cookie-parser";

import { connectMongoDB } from "./db/connectMongoDB.js";
import { logger } from "./middleware/logger.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";

import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRouters.js";
import bookingRoutes from "./routes/bookingRoutes.js";

import swaggerUi from "swagger-ui-express";
import spec from "./swagger/spec.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to SIM API" });
});

app.use(logger);
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/auth", authRouter);
app.use(userRouter);
app.use(bookingRoutes);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));

app.use(notFoundHandler);

app.use(errors());

app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
