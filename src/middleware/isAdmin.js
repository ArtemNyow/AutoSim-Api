import createHttpError from "http-errors";

export const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return next(createHttpError(401, "Не авторизований"));
    }
    if (!req.user.isAdmin) {
      return next(createHttpError(403, "Немає прав доступу"));
    }

    next();
  } catch (err) {
    next(err);
  }
};
