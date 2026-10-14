import express from "express";
import cors from "cors";
import healthRoutes from "./modules/health/health.routes";
import { notFoundMiddleware } from "./middlewares/not-found.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/health", healthRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;