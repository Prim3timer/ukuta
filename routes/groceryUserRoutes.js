const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJwT");
const groceryUsersController = require("../controllers/groceryUsersController");

// router.use(verifyJWT)

router
  .route("/")
  .get(groceryUsersController.getAllUsers)
  .post(groceryUsersController.createNewUser);

router.route("/delete/:id").delete(groceryUsersController.deleteUser);

router.route("/update/:id").patch(groceryUsersController.updateUser);

router.route("/sessions/:id").post(groceryUsersController.addToCart);

router.route("/sessions/delete").delete(groceryUsersController.deleteCartItem);

router.route("/clear/:id").delete(groceryUsersController.clearCart);

module.exports = router;
