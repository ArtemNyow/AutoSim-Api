import createHttpError from "http-errors";
import Booking from "../models/Booking.js";
import Simulator from "../models/Simulator.js";
import { calculatePrice } from "../utils/price.js";

export const createBooking = async (req, res, next) => {
  try {
    const {
      simulatorId,
      startTime,
      endTime,
      comment,
      name,
      socialLink,
      phone,
    } = req.body;

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
      bookingData.guestInfo = { name, socialLink, phone };
    }

    const overlapping = await Booking.findOne({
      simulatorId,
      status: { $in: ["В обробці", "Підтверджено"] },
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
      .populate("user", "firstName phone socialLink")
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
export const getSimulatorAvailabilitySlots = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) return res.status(400).json({ message: "date query required" });

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      simulatorId: id,
      status: { $in: ["Підтверджено"] },
      startTime: { $lt: endOfDay },
      endTime: { $gt: startOfDay },
    }).select("startTime endTime -_id");

    const slots = [];
    const slotDurationMinutes = 30;

    let current = new Date(startOfDay);

    while (current < endOfDay) {
      const slotStart = new Date(current);
      const slotEnd = new Date(current.getTime() + slotDurationMinutes * 60000);

      const booked = bookings.some(
        (b) =>
          slotStart < new Date(b.endTime) && slotEnd > new Date(b.startTime)
      );

      slots.push({
        startTime: slotStart,
        endTime: slotEnd,
        booked,
      });

      current = slotEnd;
    }

    res.status(200).json({ date, slots });
  } catch (err) {
    next(err);
  }
};
