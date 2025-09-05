const Unit = require("../models/Unit");

// Lấy danh sách unit
const getUnits = async (req, res) => {
  try {
    const units = await Unit.find()
      .sort({ index: 1 })
      .populate({
        path: "lessons",
        select: "-dialogue -audioUrl -__v",
      })
      .select("-index -__v");
    res.json(units);
  } catch (err) {
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
