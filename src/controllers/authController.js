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
    const { phone, password, firstName } = req.body;

    const exists = await User.findOne({ phone });
    if (exists)
      return next(createHttpError(409, "Телефон вже використовується"));

    const newUser = await User.create({
      phone,
      password: await bcrypt.hash(password, 10),
      firstName,
    });

    const session = await createSession(newUser._id);
    setSessionCookies(res, session);

    res.status(201).json({
      message: "Реєстрація успішна",
      user: newUser,
    });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });
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
