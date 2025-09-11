import React, { useState } from "react";
import styles from "../styles/LessonItem.module.css";
import LessonPreviewModal from "./LessonPreviewModal";
import { Check, Lock } from "lucide-react";
export default function LessonItem({
  index,
  week,
  id,
  title,
  description,
  status,
  icon,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const lessonData = {
    id,
    week: `Tuần ${week}`,
    title,
    description,
    icon,
  };

  const handleStartClick = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
    console.log(lessonData);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <article className={styles.lessonItem}>
        <div
          className={`${styles.iconBlock} ${
            status === "completed" ? styles.done : ""
          }`}
        >
          <img className={styles.lessonIcon} src={icon} alt="Lesson Icon" />
        </div>
        <div className={styles.lessonIntro}>
          <span>Ngày {index}</span>
          <h3 className={styles.title}>{title}</h3>
          {/* {description ? (
              <ul>
                <li>{description}</li>
              </ul>
            ) : null} */}
        </div>
        <div className={styles.lessonStatus}>
          {status === "locked" ? (
            <Lock size={20} color="grey" />
          ) : status === "completed" ? (
            <Check size={20} color="green" />
          ) : (
            <button onClick={handleStartClick} className={styles.startBtn}>
              <span>スタート</span>
            </button>
          )}
        </div>
      </article>

      <LessonPreviewModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        lessonData={lessonData}
      />
    </>
  );
}
