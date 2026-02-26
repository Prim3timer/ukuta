const GroceryTransaction = require("../models/GroceryTransacton");
const GroceryItem = require("../models/GroceryItem");
const asyncHandler = require("express-async-handler");
const { createNewTransaction } = require("./transactionsController");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const getAllTransactions = asyncHandler(async (req, res) => {
  const transactions = await GroceryTransaction.find();
  if (!transactions?.length) {
    return res.status(400).json({ message: "no transactions found" });
  }
  res.json(transactions);
});

const createNewTransaction = asyncHandler(async (req, res) => {
  var { cashier, cashierID, goods, date, status, grandTotal } = req.body;

  // Confirm data
  if (!goods) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // if (duplicate) {
  //     return res.status(409).json({ message: 'Duplicate item' })
  // }
  // const currentDay = new Date()

  // const formatedDate = format(currentDay, 'yyyy MM dd\tHH:mm:ss')
  // date = formatedDate
  const transactionObject = {
    cashier,
    cashierID,
    goods,
    status,
    date,
    grandTotal: grandTotal,
  };

  // Create and store new item
  const transaction = await GroceryTransaction.create(transactionObject);

  if (transaction) {
    //created
    res.status(201).json({ message: `transaction complete` });
  } else {
    res.status(400).json({ message: "Invalid transaction data received" });
  }
});

module.exports = {
  getAllTransactions,
  createNewTransaction,
};
