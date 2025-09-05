const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  lessonNumber: { type: Number, required: true },
  description: { type: String },
  icon: { type: String, default: "japan_fan.png" },
  audioUrl: { type: String, required: true },
  dialogue: [
    {
      speaker: { type: String, required: true },
      text: { type: String, required: true },
    },
  ],
  unit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Unit",
    required: true,
  },
});

const Lesson = mongoose.model("Lesson", lessonSchema);
module.exports = Lesson;
