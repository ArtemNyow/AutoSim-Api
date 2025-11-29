import { model, Schema } from "mongoose";
import { BOOKING_STATUS, STATUS } from "../constants/status.js";

const bookingSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    guestInfo: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
    },
    simulatorId: {
      type: Schema.Types.ObjectId,
      ref: "Simulator",
      required: true,
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: BOOKING_STATUS,
      default: STATUS.PENDING,
    },
    comment: { type: String },
  },
  { timestamps: true, versionKey: false }
);

export const Booking = model("Booking", bookingSchema);
export default Booking;
