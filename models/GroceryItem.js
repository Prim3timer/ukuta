const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const Schema = mongoose.Schema;

const groceryItemSchema = new Schema({
  name: {
    type: String,
    // required: true
  },
  unitMeasure: {
    type: Array,
    // required: true
  },
  availablePrices: {
    type: Array,
    requred: true,
  },
  qty: {
    type: Number,
    // required: true
  },
  img: {
    type: Array,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  availableColours: {
    type: Array,
  },
  availableStorage: {
    type: Array,
  },
  availableFootSizes: {
    type: Array,
  },
  gender: {
    type: String,
  },
  date: { type: String, required: true },
});

module.exports = mongoose.model("GroceryItem", groceryItemSchema);
