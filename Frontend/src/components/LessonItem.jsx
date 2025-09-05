import React, { useState } from "react";
import styles from "../styles/LessonItem.module.css";
import LessonPreviewModal from "./LessonPreviewModal";

export default function LessonItem({
  lessonNumber = 1,
  description = "greeting others and saying goodbye",
  icon = "/japan_fan.png",
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const lessonData = {
    title: "Where objects are misplaced",
    description: "Basic directions so you can play lost & found",
    icon: icon,
  };

  const handleStartClick = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
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
            <h3 className={styles.title}>Lesson {lessonNumber}</h3>
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
