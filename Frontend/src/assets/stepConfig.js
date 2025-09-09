const stepConfig = {
  1: {
    title: "Bước 1: Đọc hiểu nội dung script",
    content:
      "Bạn đã hoàn thành việc chọn unit và chuẩn bị tài liệu. Hãy đọc kỹ transcript để hiểu nội dung trước khi chuyển sang bước tiếp theo.",
    warning:
      '📖 Hãy đọc và hiểu rõ nội dung transcript trước khi bấm "Tiếp theo"',
    allowedControls: [],
    allowedNote: true,
    transcriptMode: "reading",
    minTime: 0,
  },
  2: {
    title: "Bước 2: Nghe rõ ý nghĩa",
    content:
      "🎧 Nghe audio và đọc transcript để hiểu rõ ý nghĩa từng từ, từng câu.\n🎭 Hãy tự hình dung ra bối cảnh hội thoại, hình ảnh nhân vật, các mối quan hệ.",
    warning: "⚠️ Nghe ít nhất 3 lần trước khi chuyển bước tiếp theo",
    allowedControls: ["play", "pause", "stop", "rewind", "forward"],
    allowedNote: false,
    transcriptMode: "reading",
    minTime: 15,
    minListens: 3,
  },
  3: {
    title: "Bước 3: Nắm bắt nhịp độ âm thanh (đầu) ",
    content:
      "👁️ Đọc đồng bộ: Vừa nghe vừa dùng mắt dõi theo lời thoại. ĐỪNG NÓI GÌ CẢ.\n🤫 Shadowing câm: Vừa nghe, vừa nhẩm lại trong đầu mà không phát âm.",
    warning: "🔇 Chỉ được nghe và đọc theo, KHÔNG được nói ra tiếng!",
    allowedControls: ["play", "pause", "stop", "rewind", "forward", "speed"],
    allowedNote: false,
    transcriptMode: "reading",
    minTime: 120,
  },
  4: {
    title: "Bước 4: Tập nói (miệng)",
    content:
      "🗣️ Shadowing cùng lời thoại: Vừa nhìn transcript, vừa nghe và nhắc lại ngay sau đó.\n🤐 Nhẩm theo: Lẩm nhẩm nhắc lại mà không nhìn transcript (có thể ẩn transcript).",
    warning: "💬 Bây giờ được phép nói! Hãy luyện tập với tốc độ tự nhiên.",
    allowedControls: ["play", "pause", "stop", "rewind", "forward", "speed"],
    allowedNote: false,
    transcriptMode: "optional",
    minTime: 180,
  },
  5: {
    title: "Bước 5: Shadowing theo nhịp điệu thực",
    content:
      "🎵 Shadowing nhịp điệu: Shadowing mà KHÔNG nhìn transcript.\n🎯 Luyện tập trung thực cùng tốc độ, cùng ngữ điệu, cùng cường độ âm thanh, cùng nhịp ngưng nghỉ.",
    warning:
      "🚫 Transcript đã bị ẩn. Tập trung vào sự lưu loát, không cần ý thức về nội dung!",
    allowedControls: ["play", "pause", "stop", "rewind", "forward", "speed"],
    allowedNote: false,
    transcriptMode: "hidden",
    minTime: 240,
  },
  6: {
    title: "Bước 6: Shadowing với nội dung",
    content:
      "🧠 Shadowing với nội dung: Vừa shadowing vừa ý thức về nội dung ý nghĩa.\n🎭 Đừng thay đổi ngữ điệu đã học, đồng thời hình dung ra tâm trạng của người nói.",
    warning: "🎪 Tưởng tượng bạn đang thực sự trong cuộc hội thoại này!",
    allowedControls: ["play", "pause", "stop", "rewind", "forward", "speed"],
    allowedNote: false,
    transcriptMode: "hidden",
    minTime: 300,
  },
};

export default stepConfig;
