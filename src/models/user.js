import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true },
    password: { type: String, required: true },
    phone: { type: String, unique: true, sparse: true },
    isAdmin: { type: Boolean, default: false },
    balance: { type: Number, default: 0 },
    socialLink: { type: String, trim: true },
  },
  { timestamps: true, versionKey: false }
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model("User", userSchema);
export default User;
