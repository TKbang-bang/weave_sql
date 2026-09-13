import { Router } from "express";

const protectedRouter = Router();

protectedRouter.get("/session", (req, res, next) => {
  res.status(204);
});

export default protectedRouter;
