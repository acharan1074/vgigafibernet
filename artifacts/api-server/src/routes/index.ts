import { Router, type IRouter } from "express";
import healthRouter from "./health";
import plansRouter from "./plans";
import connectionsRouter from "./connections";
import authRouter from "./auth";
import customersRouter from "./customers";
import complaintsRouter from "./complaints";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(plansRouter);
router.use(connectionsRouter);
router.use(authRouter);
router.use(customersRouter);
router.use(complaintsRouter);
router.use(adminRouter);

export default router;
