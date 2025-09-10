const mongoose = require("mongoose");
// Progress Schema
const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  currentLesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
  status: {
    type: String,
    enum: ["in-progress", "completed"],
    default: "in-progress",
  },
  updatedAt: { type: Date, default: Date.now },
});

const Progress = mongoose.model("Progress", progressSchema);
module.exports = Progress;
