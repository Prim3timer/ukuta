const express = require("express");
const router = express.Router();
const groceryRefreshTokenController = require("../controllers/groceryRefreshTokenController");
const groceryAuthController = require("../controllers/groceryAuthController");
const loginLimiter = require("../middleware/loginLimiter");

router.route("/").post(groceryAuthController.handleLogin);
// router.route('/refresh').get(groceryRefreshTokenController.handleRefreshToken);
router.route("/logout").get(groceryAuthController.handleLogout);

module.exports = router;
