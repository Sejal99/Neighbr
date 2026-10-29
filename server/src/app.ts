import express from "express";
import cors from "cors";
import { notFoundMiddleware } from "./middlewares/not-found.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import authRoutes from "./modules/auth/routes";
import societyRoutes from "./modules/societies/routes";
import complaintRoutes from "./modules/complaints/routes"
import facilityRoutes from "./modules/facilities/routes";
import bookingRoutes from "./modules/bookings/routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "Backend connected" });
});

app.use("/auth", authRoutes);
app.use("/societies", societyRoutes);
app.use("/complaints", complaintRoutes);
app.use("/facilities", facilityRoutes);
app.use("/bookings", bookingRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;