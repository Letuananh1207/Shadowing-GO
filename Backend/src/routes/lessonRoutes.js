const express = require("express");
const { getLessons, createLesson } = require("../controllers/lessonController");

const router = express.Router();

router.get("/:id", getLessons);
router.post("/", createLesson);

module.exports = router;
