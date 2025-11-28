import { model, Schema } from "mongoose";

const simulatorSchema = new Schema(
  {
    name: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    pricePerHour: { type: Number, required: true },
  },
  { timestamps: true, versionKey: false }
);

export const Simulator = model("Simulator", simulatorSchema);
export default Simulator;
