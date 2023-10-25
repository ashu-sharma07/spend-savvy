import express from "express";
import {
  getAllTransactions,
  createTransaction,
  getSingleTransaction,
  deleteSingleTransaction,
  getGraphData,
} from "../controllers/transactionController.js";
import { isAuthenticatedUser } from "../middleware/auth.js";
const router = express.Router();

router.route("/transaction").get(isAuthenticatedUser, getAllTransactions);
router.route("/transaction/new").post(isAuthenticatedUser, createTransaction);
router
  .route("/transaction/graph/:catname")
  .get(isAuthenticatedUser, getGraphData);
router
  .route("/transaction/:id")
  .get(isAuthenticatedUser, getSingleTransaction)
  .delete(isAuthenticatedUser, deleteSingleTransaction);

export default router;
