const GroceryTransaction = require("../models/GroceryTransaction");
const GroceryItems = require("../models/GroceryItem");
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
  console.log({ goods });
  const dbItems = await GroceryItems.find().exec();
  const newDb = dbItems.map((item) => {
    return item._id;
  });
  console.log({ newDb });
  // Create and store new item
  const transaction = await GroceryTransaction.create(transactionObject);
  // const trans = dbItems.filter((item) => {
  //   const goodies = goods.find((good) => good._id == item._id);
  //   return goodies;
  // });

  const inventoryUPdate = dbItems.map((item) => {
    goods.map(async (good) => {
      if (item._id == good._id) {
        await GroceryItems.updateOne(
          { _id: good._id },
          { qty: item.qty - good.qty, date },
        );
      }
    });
  });
  if (transaction) {
    //   //created
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
