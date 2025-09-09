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
import stepConfig from "../assets/stepConfig";

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
  const audioRef = useRef(null);
  const stepTimerRef = useRef(null);
  const stepStartTimeRef = useRef(0);
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

  // Audio event handlers
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
            <span>{lesson.timeLimit}</span>
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
