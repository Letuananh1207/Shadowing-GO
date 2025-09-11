const Note = require("../models/Note");

const createNote = async (req, res) => {
  // Kiểm tra authentication
  if (!req.user) {
    return res.status(401).json({ error: "Bạn chưa đăng nhập" });
  }

  try {
    const { lessonId, content } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!lessonId || !content || !Array.isArray(content)) {
      return res.status(400).json({
        error: "Dữ liệu không hợp lệ. LessonId và content (array) là bắt buộc.",
      });
    }

    // Kiểm tra xem đã tồn tại note cho user và lesson này chưa
    const existingNote = await Note.findOne({
      lessonId: lessonId,
      userId: userId,
    });

    let savedNote;

    if (existingNote) {
      // Nếu đã tồn tại thì update
      existingNote.content = content;
      existingNote.updatedAt = new Date();
      savedNote = await existingNote.save();

      console.log(
        `Updated existing note for user ${userId}, lesson ${lessonId}`
      );
    } else {
      // Nếu chưa tồn tại thì tạo mới
      savedNote = await Note.create({
        lessonId,
        content,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`Created new note for user ${userId}, lesson ${lessonId}`);
    }

    // Trả về response thành công
    res.status(200).json({
      success: true,
      message: existingNote
        ? "Cập nhật ghi chú thành công!"
        : "Lưu ghi chú thành công!",
      data: {
        noteId: savedNote._id,
        lessonId: savedNote.lessonId,
        contentCount: savedNote.content.length,
        updatedAt: savedNote.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error in createNote:", error);

    // Xử lý các loại lỗi khác nhau
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Dữ liệu không hợp lệ",
        details: error.message,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        error: "ID không hợp lệ",
      });
    }

    // Lỗi server chung
    res.status(500).json({
      error: "Có lỗi xảy ra khi lưu ghi chú. Vui lòng thử lại.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Thêm function để lấy notes (optional)
const getNotesByLesson = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Bạn chưa đăng nhập" });
  }

  try {
    const { id } = req.params;
    const userId = req.user._id;

    const note = await Note.findOne({
      lessonId: id,
      userId: userId,
    });

    if (!note) {
      return res.status(200).json({
        success: true,
        data: {
          content: [],
          message: "Chưa có ghi chú nào cho bài học này",
        },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        noteId: note._id,
        content: note.content,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error in getNotesByLesson:", error);
    res.status(500).json({
      error: "Có lỗi xảy ra khi lấy ghi chú",
    });
  }
};

module.exports = {
  createNote,
  getNotesByLesson,
};
