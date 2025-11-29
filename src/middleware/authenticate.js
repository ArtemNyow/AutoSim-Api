import createHttpError from "http-errors";
import { Session } from "../models/session.js";
import { User } from "../models/user.js";
import { FIFTEEN_MINUTES } from "../constants/time.js";

export const authenticate = async (req, res, next) => {
  try {
    const { accessToken, sessionId } = req.cookies;
    if (!accessToken || !sessionId) {
      return next(createHttpError(401, "Missing access token or sessionId"));
    }

    const session = await Session.findOne({ _id: sessionId, accessToken });
    if (!session) return next(createHttpError(401, "Session not found"));

    if (new Date() > new Date(session.accessTokenValidUntil)) {
      return next(createHttpError(401, "Access token expired"));
    }

    session.accessTokenValidUntil = new Date(Date.now() + FIFTEEN_MINUTES);
    await session.save();

    const user = await User.findById(session.userId);
    if (!user) return next(createHttpError(401, "User not found"));

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export const authenticateOptional = async (req, res, next) => {
  const { accessToken, sessionId } = req.cookies || {};
  if (!accessToken || !sessionId) {
    req.user = null;
    return next();
  }
  try {
    const session = await Session.findOne({ _id: sessionId, accessToken });
    if (!session) {
      req.user = null;
      return next();
    }

    if (new Date() > new Date(session.accessTokenValidUntil)) {
      req.user = null;
      return next();
    }

    session.accessTokenValidUntil = new Date(Date.now() + FIFTEEN_MINUTES);
    await session.save();

    const user = await User.findById(session.userId);
    req.user = user || null;
    next();
  } catch (err) {
    req.user = null;
    next();
  }
};
