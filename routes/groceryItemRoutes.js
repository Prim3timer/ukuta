const express = require("express");
const router = express.Router();
const groceryItemsController = require("../controllers/groceryItemsController");

router.route("/").get(groceryItemsController.getAllItems);
// router.route("/").get(groceryItemsController.mekaSomething);

router.route("/").post(groceryItemsController.createNewItem);

module.exports = router;
