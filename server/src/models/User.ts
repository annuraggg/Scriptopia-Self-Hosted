import { softDeletePlugin } from "@/plugins/softDelete";
import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    problemId: { type: String, required: true },
  },
  { timestamps: true }
);

const WalletSchema = new mongoose.Schema({
  address: { type: String, required: true },
  privateKey: { type: String, required: true, select: false },
  balance: { type: Number, default: 0 },
  transactions: { type: [TransactionSchema], required: false },
});

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    streak: { type: [Date] },
    wallet: { type: WalletSchema, default: null },
    name: { type: String, required: true },

    isSample: { type: Boolean, default: false },
    sampleInstituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
    },

    publicMetadata: {
      type: Object,
      default: {},
    },
    privateMetadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

userSchema.plugin(softDeletePlugin);
const User = mongoose.model("User", userSchema);
export default User;
