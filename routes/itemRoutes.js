const express = require("express");
const router = express.Router();
const itemsController = require("../controllers/itemsController");
const multer = require("multer");
const fs = require("fs");

router.route("/").get(itemsController.getAllItems);

router.route("/").post(itemsController.createNewItem);

// router.route('/pic/:id')
// .post(itemsController.updateImage)

router.route("/delete/:id").delete(itemsController.deleteItem);
router.route("/:id").get(itemsController.getAnItem);
router.route("/:id").patch(itemsController.updateItem);
router.route("/inventory/:id").patch(itemsController.updateInventoryyy);
router.route("/dynam").put(itemsController.updateInventoryy);

router.route("/texts/:obj").patch(itemsController.updateItemTexts);

module.exports = router;
