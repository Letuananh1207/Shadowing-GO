import React from "react";
import styles from "../styles/DashBoard.module.css";
import LessonItem from "./LessonItem";
export default function MainContent() {
  return (
    <div className={styles.dashBoard}>
      <div className={styles.mainBoard}>
        <section className={styles.unit}>
          <header>
            <p>CHƯƠNG 1:</p>
            <h2>Hội thoại gia đình - vợ chồng - người yêu</h2>
          </header>
          <hr />
          <div className={styles.lessonList}>
            <LessonItem />
            <hr />
            <LessonItem />
            <hr />
            <LessonItem />
          </div>
        </section>
      </div>
      <div className={styles.sideBar}>Side bar</div>
    </div>
  );
}
