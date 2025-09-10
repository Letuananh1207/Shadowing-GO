const Progress = require("../models/Progress");

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

module.exports = { createProgress };
