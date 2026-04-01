const express = require("express");
const router = express.Router();

const groceryTransactionsController = require("../controllers/groceryTransactionsController");

router
  .route("/")
  .get(groceryTransactionsController.getAllTransactions)
  .post(groceryTransactionsController.createNewTransaction);

router
  .route("/create-checkout-session")
  .post(groceryTransactionsController.makePayment);

router
  .route("/thanks/:sessionId")
  .post(groceryTransactionsController.thanksAlert);

router
  .route(`/old-session/:sessionId`)
  .get(groceryTransactionsController.getSessionId);

router.route("/:id").delete(groceryTransactionsController.deleteTransaction);

module.exports = router;
