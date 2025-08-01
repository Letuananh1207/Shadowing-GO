import styles from "../styles/LessonItem.module.css";

export default function LessonItem() {
  return (
    <article className={styles.lessonItem}>
      <img
        className={styles.lessonIcon}
        src="/japan_fan.png"
        alt="Lesson Icon"
      />
      <div className={styles.lessonIntro}>
        <div>
          <p className={styles.subtitle}>Lesson 1</p>
          <h2 className={styles.title}>Dag, Marie! Part 1</h2>
          <ul>
            <li>greeting others and saying goodbye</li>
          </ul>
        </div>
      </div>
      <div className={styles.lessonStatus}>
        <button>スタート</button>
      </div>
    </article>
  );
}
