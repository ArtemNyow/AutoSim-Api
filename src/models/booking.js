import { model, Schema } from "mongoose";
import { BOOKING_STATUS, STATUS } from "../constants/status.js";

const bookingSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
  },
  { timestamps: true, versionKey: false }
);

export const Booking = model("Booking", bookingSchema);
export default Booking;
