import { model, Schema } from "mongoose";

const certificateSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    code: { type: String, required: true, unique: true },
    value: { type: Number, required: true }, // сума або кількість годин
    isUsed: { type: Boolean, default: false },
    expiresAt: { type: Date },
  },
  { timestamps: true, versionKey: false }
);

export const Certificate = model("Certificate", certificateSchema);
export default Certificate;
