import { Router } from "express";
import { adminOnly, protect } from "../middlewares/auth.js";
import { approveRestaurant, getAdminStats, getAllRestaurants } from "../controllers/adminController.js";

const adminRouter = Router();

adminRouter.use(protect);
adminRouter.use(adminOnly);

adminRouter.get("/restaurants", getAllRestaurants);
adminRouter.put("/restaurants/:id/approve", approveRestaurant);
adminRouter.get("/stats", getAdminStats);

export default adminRouter;
