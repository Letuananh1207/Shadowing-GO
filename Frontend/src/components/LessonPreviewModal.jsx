import { useNavigate } from "react-router-dom";
import styles from "../styles/LessonPreviewModal.module.css";

const LessonPreviewModal = ({ isOpen, onClose, lessonData }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  const handlePlayLesson = () => {
    navigate(`/learn/${lessonData.id}`);
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
              <p>Học cách từ chối 1 ai đó</p>
            </div>
          </div>

          <div className={styles.lessonModes}>
            <div className={styles.modeItem}>
              <div className={styles.modeInfo}>
                <span className={styles.modeLabel}>Luyện tập shadowing</span>
                <div className={styles.modeDesc}>{lessonData.description}</div>
              </div>
              <button className={styles.playBtn} onClick={handlePlayLesson}>
                スタート
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPreviewModal;
