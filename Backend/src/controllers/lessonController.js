const Lesson = require("../models/Lesson");

// Lấy danh sách lesson
const getLessons = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const lesson = await Lesson.findById(lessonId);
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tạo user mới
const createLesson = async (req, res) => {
  try {
    const { lessonNumber, description, icon, audioUrl, dialogue, unit } =
      req.body;
    const newLesson = new Lesson({
      lessonNumber,
      description,
      icon,
      audioUrl,
      dialogue,
      unit,
    });
    await newLesson.save();
    res.status(201).json(newLesson);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { getLessons, createLesson };
