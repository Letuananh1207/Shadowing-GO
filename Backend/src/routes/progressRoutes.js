const express = require("express");
const { updateProgress } = require("../controllers/progressController");

const router = express.Router();

router.post("/", updateProgress);

module.exports = router;
