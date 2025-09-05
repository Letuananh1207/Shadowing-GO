const express = require("express");
const { getLessons, createLesson } = require("../controllers/lessonController");

const router = express.Router();

router.get("/", getLessons);
router.post("/", createLesson);

module.exports = router;
