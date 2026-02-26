const GroceryItems = require("../models/GroceryItem");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { format, yearsToDays } = require("date-fns");
const { default: nodemon } = require("nodemon");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { availableParallelism } = require("os");

const getAllItems = asyncHandler(async (req, res) => {
  const items = await GroceryItems.find().lean();
  //  const newData = await fsPromises.readFile(path.join(__dirname, '..', 'images', 'credit.jpg' ), 'utf8')
  // console.log(newData)
  if (!items?.length) {
    return res.status(400).json({ message: "No items found" });
  }

  res.json({ items });
});

const createNewItem = asyncHandler(async (req, res) => {
  console.log({ reqBody: req.body });
  res.send("item created");
  const {
    name,
    availableUnitMeasures,
    availablePrices,
    now,
    image,
    description,
    category,
    qty,
  } = req.body;
  console.log({ name, availableUnitMeasures, availablePrices });
  // const items = await GroceryItem.find();
  // const date = now;
  // const img = image;
  // console.log({ description });
  // // Confirm data
  if (!name || !availableUnitMeasures || !availablePrices) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicate username
  const duplicate = await GroceryItems.findOne({ name, availableUnitMeasures })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate item" });
  }

  const itemObject = {
    name,
    availableUnitMeasures,
    availablePrices,
    qty,
    date: now,
    img: image,
    description,
    category,
  };

  // Create and store new item
  const item = await GroceryItems.create(itemObject);

  if (item) {
    //created

    res.status(201).json({ message: `New item ${name} created` });
  } else {
    res.status(400).json({ message: "Invalid item data received" });
  }
});

const mekaSomething = asyncHandler(async (req, res) => {
  const alert = "checking for mama";
  console.log({ alert });
  res.send(alert);
});

module.exports = {
  mekaSomething,
  getAllItems,
  createNewItem,
};
