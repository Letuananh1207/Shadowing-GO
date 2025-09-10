import React, { useState } from "react";
import styles from "../styles/LessonItem.module.css";
import LessonPreviewModal from "./LessonPreviewModal";
import { Check, Lock } from "lucide-react";
export default function LessonItem({
  index,
  week,
  id,
  description,
  status,
  icon,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const lessonData = {
    id,
    title: `Tuần ${week}`,
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
        <img className={styles.lessonIcon} src={icon} alt="Lesson Icon" />
        <div className={styles.lessonIntro}>
          <div>
            <h3 className={styles.title}>Ngày {index}</h3>
            {description ? (
              <ul>
                <li>{description}</li>
              </ul>
            ) : null}
          </div>
        </div>
        <div className={styles.lessonStatus}>
          {status === "locked" ? (
            <Lock size={24} color="red" />
          ) : status === "completed" ? (
            <Check size={24} color="green" />
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
