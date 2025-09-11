const express = require("express");
const {
  createNote,
  getNotesByLesson,
} = require("../controllers/noteController");

const router = express.Router();

router.post("/", createNote);
router.get("/:id", getNotesByLesson);
module.exports = router;
