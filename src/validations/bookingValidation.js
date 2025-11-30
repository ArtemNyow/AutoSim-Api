import { celebrate, Joi, Segments } from "celebrate";
import { STATUS } from "../constants/status.js";

export const createBookingValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    simulatorId: Joi.string().required(),
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
    comment: Joi.string().allow("", null).optional(),
    name: Joi.string().allow("", null).optional(),
    phone: Joi.string().allow("", null).optional(),
    socialLink: Joi.string().allow("", null).optional(),
  }),
});

export const updateBookingValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    status: Joi.string().valid(...Object.values(STATUS)),
    comment: Joi.string().allow("", null),
    startTime: Joi.date(),
    endTime: Joi.date(),
    price: Joi.number(),
  }),
});

export const checkAvailabilityValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required(),
  }),
  [Segments.QUERY]: Joi.object().keys({
    date: Joi.date().required(),
  }),
});
