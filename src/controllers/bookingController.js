import createHttpError from "http-errors";
import Booking from "../models/Booking.js";
import Simulator from "../models/Simulator.js";
import { calculatePrice } from "../utils/price.js";

export const createBooking = async (req, res, next) => {
  try {
    const { simulatorId, startTime, endTime, comment, name, email, phone } =
      req.body;

    if (!req.user && (!name || name.trim() === "")) {
      return next(createHttpError(400, "Name is required for guest booking"));
    }

    const simulator = await Simulator.findById(simulatorId);
    if (!simulator) return next(createHttpError(404, "Симулятор не знайдено"));

    const price = calculatePrice(startTime, endTime);

    const bookingData = { simulatorId, startTime, endTime, price, comment };

    if (req.user) {
      bookingData.user = req.user._id;
    } else {
      bookingData.guestInfo = { name, email, phone };
    }

    const overlapping = await Booking.findOne({
      simulatorId,
      status: { $in: ["У процесі", "Підтверджено"] },
      $or: [
        { startTime: { $lt: new Date(endTime), $gte: new Date(startTime) } },
        { endTime: { $lte: new Date(endTime), $gt: new Date(startTime) } },
        {
          startTime: { $lte: new Date(startTime) },
          endTime: { $gte: new Date(endTime) },
        },
      ],
    });
    if (overlapping)
      return next(createHttpError(400, "У цей час вже заброньовано"));

    const booking = await Booking.create(bookingData);
    res.status(201).json({ message: "Бронювання створено", booking });
  } catch (err) {
    next(err);
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("simulatorId", "name")
      .sort({ startTime: -1 });

    res.status(200).json({ bookings });
  } catch (err) {
    next(err);
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "firstName phone email")
      .populate("simulatorId", "name")
      .sort({ startTime: -1 });

    res.status(200).json({ bookings });
  } catch (err) {
    next(err);
  }
};

export const updateBookingByAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const booking = await Booking.findById(id);
    if (!booking) return next(createHttpError(404, "Бронювання не знайдено"));

    Object.assign(booking, updates);
    await booking.save();

    res.status(200).json({ message: "Бронювання оновлено", booking });
  } catch (err) {
    next(err);
  }
};
