const GroceryTransaction = require("../models/GroceryTransaction");
const GroceryItem = require("../models/GroceryItem");
const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const getAllTransactions = asyncHandler(async (req, res) => {
  const groceryTransactions = await GroceryTransaction.find();
  if (!groceryTransactions.length) {
    return res.status(400).json("no transaction found");
  }
  res.json(groceryTransactions);
});

const createNewTransaction = asyncHandler(async (req, res) => {
  const { cashier, cashierID, status, goods, date, grandTotal, cashPaid } =
    req.body;
  if (!goods) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const transactionObject = {
    cashier,
    cashierID,
    goods,
    status,
    date,
    cashPaid,
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

const deleteTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Note ID required" });
  }

  // Confirm note exists to delete
  const item = await GroceryTransaction.findById(id).exec();

  if (!item) {
    return res.status(400).json({ message: "Transaction not found" });
  }

  const result = await item.deleteOne();

  const reply = `Transaction '${item.name}' with ID ${item._id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllTransactions,
  createNewTransaction,
  deleteTransaction,
};
