const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const groceryTransactionSchema = Schema({
  title: {
    type: String,
    default: "Mauwuhi",
  },
  cashier: {
    type: String,
    // required: true
  },
  cashierID: {
    type: String,
    // required: true
  },

  goods: {
    type: Array,
    required: true,
  },

  status: {
    type: String,
    default: "pending",
  },
  grandTotal: {
    type: Number,
    required: true,
  },
  last4: {
    type: Number,
  },
  cashPaid: {
    type: String,
  },
  lastFour: {
    type: String,
  },
  date: { type: String, required: true },
  name: {
    type: String,
  },
});

module.exports = mongoose.model("GroceryTransaction", groceryTransactionSchema);
