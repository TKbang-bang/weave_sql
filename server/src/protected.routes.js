import { Router } from "express";

const protectedRouter = Router();

protectedRouter.get("/session", (req, res, next) => {
  res.status(201).json({ message: "Be a good user" });
});

export default protectedRouter;
