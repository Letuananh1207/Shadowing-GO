const mongoose = require("mongoose");

const unitSchema = new mongoose.Schema({
  index: { type: Number, required: true },
  title: { type: String, required: true },
  subTitle: { type: String, required: true },
});

unitSchema.virtual("lessons", {
  ref: "Lesson",
  localField: "_id",
  foreignField: "unit",
});

unitSchema.set("toObject", { virtuals: true });
unitSchema.set("toJSON", { virtuals: true });

const Unit = mongoose.model("unit", unitSchema);
module.exports = Unit;
