import React from "react";
import styles from "../styles/MainContent.module.css";
import LessonItem from "./LessonItem";
export default function MainContent() {
  return (
    <div className={styles.dashBoard}>
      <div className={styles.mainBoard}>
        <section className={styles.unit}>
          <header>
            <p>UNIT 1:</p>
            <h2>家族 ・夫婦・恋人の会話</h2>
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

        <section className={styles.unit}>
          <header>
            <p>UNIT 1:</p>
            <h2>家族 ・夫婦・恋人の会話</h2>
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
