const Unit = require("../models/Unit");
const Progress = require("../models/Progress");

const getUnits = async (req, res) => {
  try {
    // 1. Lấy tất cả units + lessons
    const units = await Unit.find()
      .sort({ index: 1 })
      .populate({
        path: "lessons",
        select: "-dialogue -audioUrl -__v -duration",
      })
      .select("-__v");

    if (!req.user?._id) {
      return res.status(401).json({ error: "User not logged in" });
    }

    // 2. Lấy progress hiện tại của user
    let progress = await Progress.findOne({ userId: req.user._id });

    let currentLessonId = null;
    let currentIndex = 1;

    // 3. Nếu user chưa có progress → tạo mới với lesson đầu tiên
    if (!progress) {
      const firstLesson = units[0]?.lessons[0];
      if (!firstLesson) return res.json(units); // unit rỗng

      progress = await Progress.create({
        userId: req.user._id,
        currentLesson: firstLesson._id,
        status: "in-progress",
      });

      currentLessonId = firstLesson._id.toString();
      currentIndex = firstLesson.index;
    } else {
      currentLessonId = progress.currentLesson?.toString() || null;

      // Nếu muốn có index của lesson, cần populate
      const currentLesson = await units
        .flatMap((u) => u.lessons)
        .find((l) => l._id.toString() === currentLessonId);
      currentIndex = currentLesson?.index || 1;
    }

    // 4. Tạo set các lesson đã hoàn thành
    const completedLessons = new Set(
      units.flatMap((u) =>
        u.lessons
          .filter((l) => l.index < currentIndex)
          .map((l) => l._id.toString())
      )
    );

    // 5. Gắn trạng thái cho từng lesson
    const unitsWithStatus = units.map((unit) => ({
      ...unit.toObject(),
      lessons: unit.lessons.map((lesson) => {
        let status = "locked";

        if (lesson._id.toString() === currentLessonId) {
          status = progress.status; // in-progress hoặc completed
        } else if (completedLessons.has(lesson._id.toString())) {
          status = "completed";
        }

        return { ...lesson.toObject(), status };
      }),
    }));

    res.json(unitsWithStatus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Tạo Unit mới
const createUnit = async (req, res) => {
  try {
    const { title, subTitle } = req.body;
    const index = (await Unit.countDocuments()) + 1;
    const newUnit = new Unit({ index, title, subTitle });
    await newUnit.save();
    res.status(201).json(newUnit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { getUnits, createUnit };
