const express = require("express");
const router = express.Router();

const groceryTransactionsController = require("../controllers/groceryTransactionsController");

router
  .route("/")
  .get(groceryTransactionsController.getAllTransactions)
  .post(groceryTransactionsController.createNewTransaction);

router.route("/:id").delete(groceryTransactionsController.deleteTransaction);

module.exports = router;
