import React, { useState } from "react";
import styles from "../styles/LessonItem.module.css";
import LessonPreviewModal from "./LessonPreviewModal";

export default function LessonItem({ id, lessonNumber, description, icon }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const lessonData = {
    id,
    title: `Bài ${lessonNumber}`,
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
            <h3 className={styles.title}>Bài {lessonNumber}</h3>
            <ul>
              <li>{description}</li>
            </ul>
          </div>
        </div>
        <div className={styles.lessonStatus}>
          <button onClick={handleStartClick} className={styles.startBtn}>
            <span>スタート</span>
          </button>
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
