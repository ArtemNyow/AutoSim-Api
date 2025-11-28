import { celebrate, Joi, Segments } from "celebrate";

export const registerValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    firstName: Joi.string().trim().required().messages({
      "string.empty": "Ім'я обов'язкове",
    }),
    lastName: Joi.string().trim().allow("", null),
    email: Joi.string().trim().email().required().messages({
      "string.email": "Невірний формат email",
      "string.empty": "Email обов'язковий",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Пароль має бути не менше 6 символів",
      "string.empty": "Пароль обов'язковий",
    }),
    phone: Joi.string()
      .pattern(/^[+0-9]{7,15}$/)
      .required()
      .messages({
        "string.pattern.base": "Невірний формат телефону",
        "string.empty": "Телефон обов'язковий",
      }),
  }),
});
