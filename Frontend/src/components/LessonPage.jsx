import React, { useState, useEffect, useRef } from "react";
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Volume2,
  Plus,
} from "lucide-react";
import styles from "../styles/LessonPage.module.css";
import { useParams } from "react-router-dom";

export default function LessonPage() {
  const { id } = useParams();
  const [lesson, setLesson] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [notes, setNotes] = useState([]);
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [listenCount, setListenCount] = useState(0);
  const [transcriptVisible, setTranscriptVisible] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [volume, setVolume] = useState(1.0);

  const audioRef = useRef(null);
  const stepTimerRef = useRef(null);
  const stepStartTimeRef = useRef(0);

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
  const currentStepConfig = stepConfig[currentStep];

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/lessons/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setLesson(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [id]);

  // Timer for tracking time spent on current step
  useEffect(() => {
    if (stepTimerRef.current) {
      clearInterval(stepTimerRef.current);
    }

    stepStartTimeRef.current = Date.now();

    stepTimerRef.current = setInterval(() => {
      const elapsed = Math.floor(
        (Date.now() - stepStartTimeRef.current) / 1000
      );
      setTimeSpent(elapsed);
    }, 1000);

    return () => {
      if (stepTimerRef.current) {
        clearInterval(stepTimerRef.current);
      }
    };
  }, [currentStep]);

  // Audio time update and event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(Math.floor(audio.currentTime));
    };

    const handleLoadedMetadata = () => {
      setDuration(Math.floor(audio.duration));
    };

    const handleEnded = () => {
      setIsPlaying(false);
      // Auto-loop for practice
      if (currentStep > 1) {
        audio.currentTime = 0;
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [currentStep]);

  // Update audio playback rate when speed changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Update audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Reset states when step changes and configure transcript visibility
  useEffect(() => {
    setListenCount(0);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Configure transcript visibility based on step
    if (currentStepConfig.transcriptMode === "hidden") {
      setTranscriptVisible(false);
    } else if (currentStepConfig.transcriptMode === "reading") {
      setTranscriptVisible(true);
    }
    // For "optional" mode, keep current visibility state
  }, [currentStep]);

  const addNote = () => {
    if (newNote.trim()) {
      const noteWithTimestamp = `${newNote.trim()}`;
      setNotes([...notes, noteWithTimestamp]);
      setNewNote("");
      setShowAddNote(false);
    }
  };

  const deleteNote = (index) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  const canProceed = () => {
    // Check minimum time requirement
    if (currentStepConfig.minTime && timeSpent < currentStepConfig.minTime)
      return false;

    // Check minimum listens requirement
    if (
      currentStepConfig.minListens &&
      listenCount < currentStepConfig.minListens
    )
      return false;

    return true;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Audio control functions
  const handlePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio
        .play()
        .then(() => {
          // Only count as a listen if starting from beginning or first play
          if (audio.currentTime === 0 || currentStep === 2) {
            setListenCount((prev) => prev + 1);
          }
        })
        .catch((error) => {
          console.error("Audio play failed:", error);
          // Fallback for demo purposes
          setIsPlaying(true);
          setListenCount((prev) => prev + 1);
        });
    }
  };

  const handleStop = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setCurrentTime(0);
  };

  const handleRewind = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.max(0, audio.currentTime - 5);
    }
  };

  const handleFastForward = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setPlaybackSpeed(newSpeed);
  };

  const handleProgressClick = (e) => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      audio.currentTime = percentage * audio.duration;
    }
  };

  const showTranscript = () => {
    if (currentStepConfig.transcriptMode === "hidden") return false;
    if (currentStepConfig.transcriptMode === "optional")
      return transcriptVisible;
    return true;
  };

  const isControlAllowed = (control) => {
    return currentStepConfig.allowedControls.includes(control);
  };

  const getNextButtonText = () => {
    if (!canProceed()) {
      const reasons = [];
      if (currentStepConfig.minTime && timeSpent < currentStepConfig.minTime) {
        const remaining = currentStepConfig.minTime - timeSpent;
        reasons.push(`còn ${formatTime(remaining)}`);
      }
      if (
        currentStepConfig.minListens &&
        listenCount < currentStepConfig.minListens
      ) {
        const remaining = currentStepConfig.minListens - listenCount;
        reasons.push(`nghe thêm ${remaining} lần`);
      }
      return `Chờ... (${reasons.join(", ")})`;
    }
    return currentStep === 6 ? "Hoàn thành 🎉" : "Tiếp theo";
  };

  const handleNextStep = () => {
    if (currentStep === 6) {
      // Complete practice - you can add completion logic here
      alert("Chúc mừng! Bạn đã hoàn thành tất cả các bước luyện tập!");
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // --- nếu chưa có dữ liệu thì show loading ---
  if (loading) {
    return <div className={styles.lessonDetail}>Loading lesson...</div>;
  }
  if (!lesson) {
    return <div className={styles.lessonDetail}>Không tìm thấy bài học.</div>;
  }

  return (
    <div className={styles.lessonDetail}>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={lesson.audioUrl}
        preload="metadata"
        loop={currentStep > 1} // Auto-loop for practice steps
      />

      {/* Step Progress */}
      <div className={styles.stepProgress}>
        <div className={styles.stepHeader}>
          <h2 className={styles.stepTitle}>{currentStepConfig.title}</h2>
          <div className={styles.stepCounter}>Bước {currentStep}/6</div>
        </div>

        <div className={styles.stepContent}>
          {/* <div style={{ whiteSpace: "pre-line" }}>
            {currentStepConfig.content}
          </div> */}
          {/* <div className={styles.warningMessage}>
            {currentStepConfig.warning}
          </div> */}
        </div>

        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${(currentStep / 6) * 100}%` }}
          />
        </div>
      </div>

      <main className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.lessonInfo}>
            {lesson.unit} / {lesson.section} / {lesson.lessonNumber}
          </div>

          <div className={styles.timeDisplay}>
            <Clock size={16} />
            <span>{lesson.timeLimit}</span>
          </div>
        </header>
        {/* Audio Controls - only show if allowed */}
        {currentStepConfig.allowedControls.length > 0 && (
          <div className={styles.audioSection}>
            {/* Volume Control */}
            <div className={styles.volumeControl}>
              {/* Audio Controls - only show if allowed */}
              {currentStepConfig.allowedControls.length > 0 && (
                <div>
                  {/* Audio Controls */}
                  <div className={styles.audioControls}>
                    {isControlAllowed("rewind") && (
                      <button
                        onClick={handleRewind}
                        className={styles.controlBtn}
                        title="Tua lại 5s"
                      >
                        <RotateCcw size={20} />
                      </button>
                    )}

                    {isControlAllowed("play") && (
                      <button
                        onClick={handlePlay}
                        className={`${styles.controlBtn} ${styles.playBtn}`}
                        title={isPlaying ? "Tạm dừng" : "Phát"}
                      >
                        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                      </button>
                    )}
                    {isControlAllowed("forward") && (
                      <button
                        onClick={handleFastForward}
                        className={styles.controlBtn}
                        title="Tua nhanh 5s"
                      >
                        <FastForward size={20} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Dialogue Content */}
        <div className={styles.dialogueArea}>
          {showTranscript() ? (
            <div className={styles.dialogueSection}>
              <div className={styles.dialogueContainer}>
                {lesson.dialogue.map((line, index) => (
                  <div key={index} className={styles.dialogueLine}>
                    <div className={styles.speakerAvatar}>{line.speaker}</div>
                    <div className={styles.messageBox}>{line.text}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.hiddenTranscript}>
              <Volume2 size={48} className={styles.audioIcon} />
              <p>Transcript đã được ẩn</p>
              <p className={styles.hiddenSubtext}>
                Tập trung vào việc nghe và nói theo
              </p>
            </div>
          )}
        </div>

        {/* Notes Section */}
        {currentStepConfig.allowedNote && (
          <div className={styles.notesSection}>
            <button
              onClick={() => setShowAddNote(!showAddNote)}
              className={`${styles.addNoteBtn} ${
                showAddNote ? styles.addNoteBtnActive : ""
              }`}
            >
              <Plus size={16} />
              Thêm Note
            </button>

            {showAddNote && (
              <div className={styles.addNoteForm}>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Nhập ghi chú của bạn..."
                  className={styles.noteTextarea}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.ctrlKey) {
                      addNote();
                    }
                    if (e.key === "Escape") {
                      setShowAddNote(false);
                      setNewNote("");
                    }
                  }}
                />
                <div className={styles.formActions}>
                  <button onClick={addNote} className={styles.saveBtn}>
                    Lưu (Ctrl+Enter)
                  </button>
                  <button
                    onClick={() => {
                      setShowAddNote(false);
                      setNewNote("");
                    }}
                    className={styles.cancelBtn}
                  >
                    Hủy (Esc)
                  </button>
                </div>
              </div>
            )}

            {notes.map((note, index) => (
              <div key={index} className={styles.noteItem}>
                <span>{note}</span>
                <button
                  onClick={() => deleteNote(index)}
                  className={styles.deleteNoteBtn}
                  title="Xóa ghi chú"
                >
                  ×
                </button>
              </div>
            ))}

            {notes.length === 0 && !showAddNote && (
              <div className={styles.emptyState}>Chưa có ghi chú nào</div>
            )}
          </div>
        )}
      </main>

      {/* Step Navigation */}
      <div className={styles.stepNavigation}>
        <button
          onClick={handlePrevStep}
          disabled={currentStep === 1}
          className={styles.navBtn}
        >
          Quay lại
        </button>

        <button
          onClick={handleNextStep}
          disabled={!canProceed()}
          className={`${styles.navBtn} ${styles.nextBtn} ${
            !canProceed() ? styles.disabled : ""
          }`}
        >
          {getNextButtonText()}
        </button>
      </div>
    </div>
  );
}
