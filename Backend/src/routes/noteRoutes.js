const express = require("express");
const { getNotes, createNote } = require("../controllers/noteController");

const router = express.Router();

router.get("/:id", getNotes);
router.post("/", createNote);

module.exports = router;
