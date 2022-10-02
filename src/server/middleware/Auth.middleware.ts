import { APP_JWT_SECRET } from "@app/constants";
import { AppLog } from "@app/providers/AppLog";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const AuthMiddleware: RequestHandler = async (req, res, next) => {
  if (req.headers.authorization) {
    if (!req.headers.authorization.startsWith("Bearer "))
      return res.status(401).json({ error: "Unauthorized", code: 401 });

    const token = req.headers.authorization.replace("Bearer ", "").trim();
    let tokenData: any | null;
    try {
      // TODO: check iat time
      tokenData = jwt.verify(token, APP_JWT_SECRET) as any | null;
    } catch (error) {
      AppLog.debug("Failed to verify token", { error });
      // invalid token
      return res.sendStatus(401);
    }

    if (!tokenData) {
      return res.sendStatus(403);
    }

    // populate req.auth context
    (req as any).token = tokenData;
  }

  next();
};
