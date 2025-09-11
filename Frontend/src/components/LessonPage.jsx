import React, { useState, useEffect, useRef } from "react";
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Volume2,
  Plus,
  HelpCircle,
  Save,
  Edit3,
  Check,
  X,
} from "lucide-react";
import styles from "../styles/LessonPage.module.css";
import { useParams } from "react-router-dom";
import stepConfig from "../assets/stepConfig";

export default function LessonPage() {
  const { id } = useParams();
  const [lesson, setLesson] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [notes, setNotes] = useState([]);
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [listenCount, setListenCount] = useState(0);
  const [transcriptVisible, setTranscriptVisible] = useState(true);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [saveNotesMessage, setSaveNotesMessage] = useState("");
  const [loadingNotes, setLoadingNotes] = useState(false);
  const audioRef = useRef(null);
  const stepTimerRef = useRef(null);
  const totalTimerRef = useRef(null);
  const stepStartTimeRef = useRef(0);
  const lessonStartTimeRef = useRef(0);
  const currentStepConfig = stepConfig[currentStep];

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/lessons/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setLesson(data);
        setLoading(false);

        // Bắt đầu đếm thời gian tổng khi load xong lesson
        lessonStartTimeRef.current = Date.now();
        startTotalTimer();

        // Load notes sau khi load lesson
        loadNotes();
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [id]);

  // Load notes từ server
  const loadNotes = async () => {
    setLoadingNotes(true);
    try {
      const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const lesson = data.data;
        // data.content là array các note strings
        if (lesson.content && Array.isArray(lesson.content)) {
          // Convert strings to objects với id để dễ quản lý
          const notesWithIds = lesson.content.map((note, index) => ({
            id: Date.now() + index, // temporary ID
            content: note,
            isLocal: false, // đánh dấu đã lưu trên server
          }));
          setNotes(notesWithIds);
        }
      }
    } catch (error) {
      console.error("Error loading notes:", error);
    } finally {
      setLoadingNotes(false);
    }
  };

  // Timer tổng cho toàn bộ bài học
  const startTotalTimer = () => {
    if (totalTimerRef.current) {
      clearInterval(totalTimerRef.current);
    }

    totalTimerRef.current = setInterval(() => {
      const elapsed = Math.floor(
        (Date.now() - lessonStartTimeRef.current) / 1000
      );
      setTotalTimeSpent(elapsed);
    }, 1000);
  };

  // Timer cho tracking time spent on current step
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

  // Cleanup timers khi component unmount
  useEffect(() => {
    return () => {
      if (stepTimerRef.current) {
        clearInterval(stepTimerRef.current);
      }
      if (totalTimerRef.current) {
        clearInterval(totalTimerRef.current);
      }
    };
  }, []);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !lesson.duration) return;

    const { start, end } = lesson.duration;

    const handlePlay = () => {
      setIsPlaying(true);
      // Nếu play từ đầu thì nhảy tới start
      if (audio.currentTime < start || audio.currentTime > end) {
        audio.currentTime = start;
      }
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleTimeUpdate = () => {
      if (audio.currentTime >= end) {
        audio.pause();
        setIsPlaying(false);

        // Nếu đang ở bước luyện tập có loop
        if (currentStep > 1) {
          audio.currentTime = start;
        }
      }
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [lesson.duration, currentStep]);

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
      const newNoteObj = {
        id: Date.now(),
        content: newNote.trim(),
        isLocal: true, // đánh dấu chưa lưu
      };
      setNotes([...notes, newNoteObj]);
      setNewNote("");
      setShowAddNote(false);
    }
  };

  const deleteNote = (noteId) => {
    setNotes(notes.filter((note) => note.id !== noteId));
  };

  const startEditNote = (noteId, content) => {
    setEditingNoteId(noteId);
    setEditingContent(content);
  };

  const saveEditNote = () => {
    if (editingContent.trim()) {
      setNotes(
        notes.map((note) =>
          note.id === editingNoteId
            ? { ...note, content: editingContent.trim(), isLocal: true }
            : note
        )
      );
    }
    setEditingNoteId(null);
    setEditingContent("");
  };

  const cancelEditNote = () => {
    setEditingNoteId(null);
    setEditingContent("");
  };

  // Hàm lưu notes lên server
  const saveNotes = async () => {
    if (notes.length === 0) {
      setSaveNotesMessage("Không có ghi chú để lưu");
      setTimeout(() => setSaveNotesMessage(""), 3000);
      return;
    }

    setIsSavingNotes(true);
    setSaveNotesMessage("");

    try {
      // Chỉ gửi content của notes
      const noteContents = notes.map((note) => note.content);

      const response = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // gửi cookie
        body: JSON.stringify({
          lessonId: id,
          content: noteContents,
        }),
      });

      if (!response.ok) {
        throw new Error("Không thể lưu ghi chú");
      }

      const data = await response.json();
      setSaveNotesMessage("✅ Lưu ghi chú thành công!");

      // Đánh dấu tất cả notes đã được lưu
      setNotes(notes.map((note) => ({ ...note, isLocal: false })));

      // Tự động ẩn thông báo sau 3 giây
      setTimeout(() => setSaveNotesMessage(""), 3000);
    } catch (error) {
      console.error("Error saving notes:", error);
      setSaveNotesMessage("❌ Có lỗi xảy ra khi lưu ghi chú");
      setTimeout(() => setSaveNotesMessage(""), 5000);
    } finally {
      setIsSavingNotes(false);
    }
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

  const getUnsavedCount = () => {
    return notes.filter((note) => note.isLocal).length;
  };

  const handleNextStep = async () => {
    if (currentStep === 6) {
      // Dừng timer tổng khi hoàn thành
      if (totalTimerRef.current) {
        clearInterval(totalTimerRef.current);
      }

      try {
        // Gọi API đánh dấu lesson hoàn thành
        const response = await fetch("http://localhost:5000/api/progress", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // gửi cookie nếu dùng session
          body: JSON.stringify({
            lessonId: id, // biến lưu lesson hiện tại
            status: "completed",
            totalTimeSpent: totalTimeSpent, // Gửi thời gian tổng lên server
          }),
        });

        if (!response.ok) {
          throw new Error("Không thể cập nhật tiến trình");
        }

        // Lấy dữ liệu JSON từ backend
        const data = await response.json();

        // Chuyển hướng dựa trên URL trả về từ backend
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
        } else {
          // fallback nếu backend không trả về
          window.location.href = "/dashboard/completed";
        }
      } catch (err) {
        console.error(err);
        alert("Có lỗi xảy ra khi lưu tiến trình");
      }
      return;
    }

    setCurrentStep((prev) => prev + 1);
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
          <div className={styles.titleWithHelp}>
            <h2 className={styles.stepTitle}>{currentStepConfig.title}</h2>
            <div className={styles.helpTooltip}>
              <HelpCircle size={14} className={styles.helpIcon} />
              <div className={styles.tooltipContent}>
                {currentStepConfig.content}
              </div>
            </div>
          </div>
          <div className={styles.stepCounter}>Bước {currentStep}/6</div>
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
            {lesson.unit.subTitle} / Bài {lesson.lessonNumber}
          </div>

          <div className={styles.timeDisplay}>
            <Clock size={16} />
            <span>{formatTime(totalTimeSpent)}</span>{" "}
            {/* Hiển thị thời gian tổng */}
          </div>
        </header>

        {/* Audio Controls - only show if allowed */}
        {currentStepConfig.allowedControls.length > 0 && (
          <div className={styles.audioSection}>
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
            <div className={styles.notesSectionHeader}>
              <h3 className={styles.notesSectionTitle}>
                📝 Ghi chú của tôi
                {loadingNotes && (
                  <span className={styles.loadingText}> (đang tải...)</span>
                )}
              </h3>

              <div className={styles.notesActions}>
                <button
                  onClick={() => setShowAddNote(!showAddNote)}
                  className={`${styles.addNoteBtn} ${
                    showAddNote ? styles.addNoteBtnActive : ""
                  }`}
                >
                  <Plus size={16} />
                  Thêm ghi chú
                </button>

                {notes.length > 0 && (
                  <button
                    onClick={saveNotes}
                    disabled={isSavingNotes}
                    className={`${styles.saveNotesBtn} ${
                      isSavingNotes ? styles.saving : ""
                    } ${getUnsavedCount() > 0 ? styles.hasUnsaved : ""}`}
                    title="Lưu tất cả ghi chú lên server"
                  >
                    <Save size={16} />
                    {isSavingNotes
                      ? "Đang lưu..."
                      : getUnsavedCount() > 0
                      ? `Lưu (${getUnsavedCount()} thay đổi)`
                      : "Đã lưu"}
                  </button>
                )}
              </div>
            </div>

            {/* Hiển thị thông báo lưu */}
            {saveNotesMessage && (
              <div
                className={`${styles.saveMessage} ${
                  saveNotesMessage.includes("✅")
                    ? styles.success
                    : styles.error
                }`}
              >
                {saveNotesMessage}
              </div>
            )}

            <div className={styles.notesContainer}>
              {/* Add Note Form */}
              {showAddNote && (
                <div className={styles.addNoteForm}>
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Nhập ghi chú của bạn..."
                    className={styles.noteTextarea}
                    onKeyDown={(e) => {
                      if (
                        (e.key === "Enter" && (e.ctrlKey || e.metaKey)) ||
                        (e.key === "Enter" && e.shiftKey)
                      ) {
                        e.preventDefault();
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
                      Thêm (Ctrl+Enter)
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

              {/* Notes List */}
              {notes.map((note) => (
                <div
                  key={note.id}
                  className={`${styles.noteItem} ${
                    note.isLocal ? styles.unsavedNote : ""
                  }`}
                >
                  {editingNoteId === note.id ? (
                    <div className={styles.editNoteForm}>
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className={styles.editTextarea}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                            e.preventDefault();
                            saveEditNote();
                          }
                          if (e.key === "Escape") {
                            cancelEditNote();
                          }
                        }}
                      />
                      <div className={styles.editActions}>
                        <button
                          onClick={saveEditNote}
                          className={styles.confirmBtn}
                          title="Lưu thay đổi (Ctrl+Enter)"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={cancelEditNote}
                          className={styles.cancelEditBtn}
                          title="Hủy chỉnh sửa (Esc)"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.noteContent}>
                      <div className={styles.noteText}>{note.content}</div>
                      <div className={styles.noteItemActions}>
                        <button
                          onClick={() => startEditNote(note.id, note.content)}
                          className={styles.editNoteBtn}
                          title="Chỉnh sửa ghi chú"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className={styles.deleteNoteBtn}
                          title="Xóa ghi chú"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {notes.length === 0 && !showAddNote && !loadingNotes && (
                <div className={styles.emptyState}>
                  <p>Chưa có ghi chú nào</p>
                  <p className={styles.emptySubtext}>
                    Thêm ghi chú để lưu lại những điểm quan trọng trong bài học
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Step Navigation */}
      <div className={styles.stepNavigation}>
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
