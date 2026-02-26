const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const Schema = mongoose.Schema;

const groceryItemSchema = new Schema({
  name: {
    type: String,
    // required: true
  },
  availableUnitMeasures: {
    type: Array,
    require: true,
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
    type: String,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    // required: true,
  },

  date: { type: String, required: true },
});

module.exports = mongoose.model("GroceryItems", groceryItemSchema);
