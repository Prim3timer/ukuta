const express = require("express");
const router = express.Router();

const { signup, getbill } = require("../controllers/emailingController");

/** HTTP Reqeust */
// router.post("/emailing", signup);
router.route("/").post(getbill);

module.exports = router;
