import { celebrate, Joi, Segments } from "celebrate";

export const registerValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    phone: Joi.string()
      .trim()
      .pattern(/^(\+?380)\d{9}$/)
      .required()
      .messages({
        "string.empty": "Телефон обов'язковий",
        "string.pattern.base": "Невірний формат телефону",
      }),
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
  [Segments.BODY]: Joi.object({
    phone: Joi.string().min(5).required(),
    password: Joi.string().min(4).required(),
  }),
});
