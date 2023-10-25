import catchAyncErrors from "../middleware/catchAyncErrors.js";
import Transaction from "../models/transactionModel.js";
import User from "../models/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import mongoose from "mongoose";

// Create Transation
export const createTransaction = catchAyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;
  const { amount, tranType } = req.body;
  const user = await User.findById(req.user.id);
  if (tranType === "Expense") {
    user.currentBalance = user.currentBalance - Number(amount);
    user.totalExpense = user.totalExpense + Number(amount);
  } else {
    user.currentBalance = user.currentBalance + Number(amount);
    user.totalIncome = user.totalIncome + Number(amount);
  }
  await user.save();
  const transaction = await Transaction.create(req.body);
  res.status(201).json({
    success: true,
    transaction,
    currentBalance: user.currentBalance,
    totalExpense: user.totalExpense,
    totalIncome: user.totalIncome,
  });
});

// Get all transactions
export const getAllTransactions = catchAyncErrors(async (req, res) => {
  const transaction = await Transaction.find({ user: req.user.id });
  res.status(200).json({ success: true, transaction });
});

// Get single transaction
export const getSingleTransaction = catchAyncErrors(async (req, res, next) => {
  const transaction = await Transaction.findById(req.params.id);
  if (!transaction) {
    return next(new ErrorHandler("Transaction not found", 404));
  }

  res.status(200).json({
    success: true,
    transaction,
  });
});

// Delete transaction
export const deleteSingleTransaction = catchAyncErrors(
  async (req, res, next) => {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return next(new ErrorHandler("Transaction not found", 404));
    }
    const user = await User.findById(req.user.id);
    if (transaction.tranType === "Expense") {
      user.currentBalance = user.currentBalance + Number(transaction.amount);
      user.totalExpense = user.totalExpense - Number(transaction.amount);
    } else {
      user.currentBalance = user.currentBalance - Number(transaction.amount);
      user.totalIncome = user.totalIncome - Number(transaction.amount);
    }

    await transaction.remove();
    res.status(200).json({
      success: true,
      currentBalance: user.currentBalance,
      totalExpense: user.totalExpense,
      totalIncome: user.totalIncome,
      message: "Transaction deleted successfully",
    });
  }
);

export const getGraphData = catchAyncErrors(async (req, res, next) => {
  const cat = req.params.catname;
  let uId = req.user.id;
  uId = mongoose.Types.ObjectId(uId);
  Transaction.aggregate([
    {
      $match: {
        category: cat,
        user: uId,
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
      },
    },
  ]).exec((error, result) => {
    if (error) {
      console.log("Error in getting graph data");
      console.log(error);
    } else {
      if (result.length === 0) {
        return res.status(200).json({
          success: true,
          result: 0,
        });
      } else {
        res.status(200).json({
          success: true,
          result: result[0].totalAmount,
        });
      }
    }
  });
});
