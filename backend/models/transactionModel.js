import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please enter Transaction name"],
    },
    description: {
      type: String,
    },
    amount: {
      type: Number,
      required: [true, "Please enter amount price"],
      maxLenght: [12, "Amount cannot exceed 12 figures"],
    },
    Date: {
      type: String,
      default: Date.now(),
    },
    category: {
      type: String,
      required: [true, "Please enter Transaction category"],
    },

    tranType: {
      type: String,
      required: [true, "Please enter Transaction type"],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
