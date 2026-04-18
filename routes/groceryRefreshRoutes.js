const express = require("express");
const router = express.Router();

const groceryRefreshTokenController = require("../controllers/groceryRefreshTokenController");

router.route("/").get(groceryRefreshTokenController.groceHandleRefreshToken);

module.exports = router;
