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
    denominator,
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
  const numerator = 0;
  const quantum = [qty, numerator];
  const itemObject = {
    name,
    availableUnitMeasures,
    availablePrices,
    qty,
    date: now,
    img: image,
    description,
    denominator,
    numerator: 0,
    availableQuantities: quantum,
    category,
    dateCreated: now,
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

const updateItemTexts = asyncHandler(async (req, res) => {
  const { id, firstName } = req.query;

  const {
    name,
    firstPrice,
    secondPrice,
    firstUnitMeasure,
    secondUnitMeasure,
    now,
    image,
    description,
    category,
    denominator,
    numerator,
    quantity,
  } = req.body;
  console.log({ quantity });
  const availableUnitMeasures = [firstUnitMeasure, secondUnitMeasure];
  const availablePrices = [firstPrice, secondPrice];
  const availableQuantities = [quantity, Number(numerator)];
  await GroceryItems.findOneAndUpdate(
    { _id: id },
    {
      name,
      availableUnitMeasures,
      availablePrices,
      date: now,
      description,
      category,
      denominator,
      availableQuantities,
      numerator,
      qty: quantity,
    },
  );
  if (firstName !== name) {
    await fs.promises.rename(
      path.join(
        __dirname,
        "..",
        "public",
        "images",
        "groceryImages",
        firstName,
      ),
      path.join(__dirname, "..", "public", "images", "groceryImages", name),
    );
  }
  res.json(`${firstName} successfuly updated`);
});

const deleteItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const name = req.query.name;
  console.log({ name });

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Note ID required" });
  }

  // Confirm note exists to delete
  const item = await GroceryItems.findById(id).exec();

  if (!item) {
    return res.status(400).json({ message: "GroceryItems not found" });
  }

  const result = await GroceryItems.deleteOne({ _id: id });

  const reply = `GroceryItems '${item.name}' with ID ${item._id} deleted`;
  if (
    fs.existsSync(
      path.join(
        __dirname,
        "..",
        "public",
        "images",
        "groceryImages",
        `./${name}`,
      ),
    )
  ) {
    const data = await fs.promises.readdir(
      path.join(__dirname, "..", "public", "images", "groceryImages", name),
    );
    console.log({ content: data.length });
    if (data.length) {
      data.map(async (file) => {
        await fs.promises.unlink(
          path.join(
            __dirname,
            "..",
            "public",
            "images",
            "groceryImages",
            name,
            file,
          ),
        );
      });
    }
    await fs.promises.rmdir(
      path.join(__dirname, "..", "public", "images", "groceryImages", name),
    );
  }
  res.json(reply);
});

module.exports = {
  mekaSomething,
  getAllItems,
  createNewItem,
  deleteItem,
  updateItemTexts,
};
