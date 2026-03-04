const express = require("express");
const router = express.Router();
const groceryItemsController = require("../controllers/groceryItemsController");

router.route("/").get(groceryItemsController.getAllItems);
// router.route("/").get(groceryItemsController.mekaSomething);

router.route("/").post(groceryItemsController.createNewItem);

router.route("/texts/:obj").patch(groceryItemsController.updateItemTexts);

router.route("/delete/:id").delete(groceryItemsController.deleteItem);


module.exports = router;
