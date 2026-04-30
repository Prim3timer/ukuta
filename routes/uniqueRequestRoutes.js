const express = require("express");
const router = express.Router();
const uniqueController = require("../controllers/usersController");

router.route("/").get(uniqueController.getAllUsers);

module.exports = router;
