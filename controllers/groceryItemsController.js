const GroceryItem = require("../models/GroceryItem");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { format, yearsToDays } = require("date-fns");
const { default: nodemon } = require("nodemon");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const getAllItems = asyncHandler(async (req, res) => {
  const items = await GroceryItem.find().lean();
  //  const newData = await fsPromises.readFile(path.join(__dirname, '..', 'images', 'credit.jpg' ), 'utf8')
  // console.log(newData)
  if (!items?.length) {
    return res.status(400).json({ message: "No items found" });
  }

  res.json({ items });
});

const createNewItem = asyncHandler(async (req, res) => {
  const {
    name,
    unitMeasure,
    availablePrices,
    image,
    now,
    description,
    category,
    gender,
    qty,
    availableColours,
    availableStorage,
    availableFootSizes,
  } = req.body;
  console.log({ qty });
  const items = await GroceryItem.find();
  const date = now;
  const img = image;
  console.log({ description });
  // Confirm data
  if (!name || !unitMeasure || !availablePrices) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicate username
  const duplicate = await GroceryItem.findOne({ name, unitMeasure })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate item" });
  }

  const itemObject = {
    name,
    unitMeasure,
    availablePrices,
    qty,
    date,
    img,
    description,
    category:
      category === "Foot Wears"
        ? "Foot WearsShoesSlippersBootsSneakersSandals"
        : category,
    gender,
    availableColours,
    availableStorage,
    availableFootSizes,
  };

  // Create and store new item
  const item = await GroceryItem.create(itemObject);

  if (item) {
    //created

    res.status(201).json({ message: `New item ${name} created` });
  } else {
    res.status(400).json({ message: "Invalid item data received" });
  }
});

module.exports = {
  getAllItems,
  createNewItem,
};
