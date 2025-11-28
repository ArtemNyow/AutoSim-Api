import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import {
  createSession,
  setSessionCookies,
  clearSessionCookies,
} from "../services/auth.js";
import { Session } from "../models/session.js";
import { User } from "../models/user.js";

export const registerUser = async (req, res, next) => {
  try {
    const { login, password, firstName } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email: login }, { phone: login }],
    });
    if (existingUser) {
      return next(createHttpError(401, "Логін вже використовується"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserData = { password: hashedPassword, firstName };
    if (login.includes("@")) newUserData.email = login;
    else newUserData.phone = login;

    const newUser = await User.create(newUserData);

    const newSession = await createSession(newUser._id);
    setSessionCookies(res, newSession);

    res.status(201).json({
      message: "Користувач зареєстрований успішно",
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { login, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: login }, { phone: login }],
    });
    if (!user) return next(createHttpError(401, "Невірний логін або пароль"));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return next(createHttpError(401, "Невірний логін або пароль"));

    const newSession = await createSession(user._id);
    setSessionCookies(res, newSession);

    res.status(200).json({ message: "Вхід успішний", user });
  } catch (err) {
    next(err);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies;
    if (sessionId) await Session.findByIdAndDelete(sessionId);
    clearSessionCookies(res);
    res.status(200).json({ message: "Вихід виконано" });
  } catch (err) {
    next(err);
  }
};
