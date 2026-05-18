const express = require("express");
const router = express.Router();
const emailingController = require("../controllers/emailingController");

router.route("/").post(emailingController.mailSender);

module.exports = router;
