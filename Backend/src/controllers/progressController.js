const Progress = require("../models/Progress");
const Lesson = require("../models/Lesson");

const createProgress = async (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: "Bạn cần đăng nhập" });
  }
  try {
    const lessonId = req.params.id;
    const userId = req.user._id;
    const newProgress = await Progress({ userId, lessonId });
    await newProgress.save();
    res.status(200);
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(501);
  }
};

const updateProgress = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Bạn cần đăng nhập" });
  }

  try {
    const { lessonId } = req.body;
    const userId = req.user._id;

    // Lấy lesson hiện tại
    const currentLesson = await Lesson.findById(lessonId);
    if (!currentLesson) {
      return res.status(404).json({ error: "Lesson không tồn tại" });
    }

    // Lấy lesson tiếp theo dựa vào index
    const nextLesson = await Lesson.findOne({ index: currentLesson.index + 1 });

    // Cập nhật progress cho user
    await Progress.updateOne(
      { userId },
      {
        $set: {
          currentLesson: nextLesson?._id || currentLesson._id,
          status: "in-progress",
        },
      },
      { upsert: true }
    );

    // Trả về URL để FE redirect
    res.json({ redirectUrl: "/dashboard/inprogress" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Có lỗi xảy ra khi cập nhật tiến trình" });
  }
};

module.exports = { createProgress, updateProgress };
