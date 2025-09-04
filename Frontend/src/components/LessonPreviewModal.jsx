import React from "react";
import styles from "../styles/LessonPreviewModal.module.css";

const LessonPreviewModal = ({ isOpen, onClose, lessonData }) => {
  if (!isOpen) return null;

  const handlePlayLesson = () => {
    // Điều hướng đến trang học
    window.location.href = "/learn";
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>

        <h2 className={styles.modalTitle}>{lessonData.title}</h2>

        <div className={styles.modalBody}>
          <div className={styles.lessonCharacter}>
            <img src={lessonData.icon || "/japan_fan.png"} alt="Character" />
            <div className={styles.speechBubble}>
              <p>Practice shadowing technique with native audio</p>
            </div>
          </div>

          <div className={styles.lessonModes}>
            <div className={styles.modeItem}>
              <div className={styles.modeInfo}>
                <span className={styles.modeLabel}>Luyện tập shadowing</span>
                <div className={styles.modeDesc}>
                  Bắt đầu bài tập shadowing bằng cách nghe và lặp lại.
                </div>
              </div>
              <button className={styles.playBtn} onClick={handlePlayLesson}>
                スタート
              </button>
            </div>
            <div className={styles.modeItem}>
              <div className={styles.modeInfo}>
                <span className={styles.modeLabel}>Story</span>
                <div className={styles.modeDesc}>......</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPreviewModal;
