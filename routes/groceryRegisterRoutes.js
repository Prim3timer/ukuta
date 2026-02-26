const express = require("express");
const router = express.Router();
const groceryRegisterController = require("../controllers/groceryRegisterController");

router.post("/", groceryRegisterController.handleNewUser);

module.exports = router;
