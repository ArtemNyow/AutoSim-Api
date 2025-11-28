import { celebrate, Joi, Segments } from "celebrate";

export const registerValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    login: Joi.string()
      .trim()
      .required()
      .messages({ "string.empty": "Логін обов'язковий" }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Пароль має бути не менше 6 символів",
      "string.empty": "Пароль обов'язковий",
    }),
    firstName: Joi.string().trim().required().messages({
      "string.empty": "Ім'я обов'язкове",
    }),
  }),
});
export const loginValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    login: Joi.string().trim().required(),
    password: Joi.string().min(6).required(),
  }),
});
