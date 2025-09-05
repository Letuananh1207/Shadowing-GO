import { useState, useEffect } from "react";
import styles from "../styles/DashBoard.module.css";
import LessonItem from "./LessonItem";
export default function MainContent() {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/units")
      .then((res) => res.json())
      .then((data) => {
        setUnits(data);
        console.log(data);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className={styles.dashBoard}>
      <div className={styles.mainBoard}>
        {units.map((unit) => (
          <section key={unit._id} className={styles.unit}>
            <header>
              <p>CHƯƠNG - {unit.title}</p>
              <h2>{unit.subTitle}</h2>
            </header>
            <hr />
            <div className={styles.lessonList}>
              {unit.lessons.map((lesson) => (
                <LessonItem
                  id={lesson._id}
                  lessonNumber={lesson.lessonNumber}
                  description={lesson.description}
                  icon={`/${lesson.icon}`}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
      <div className={styles.sideBar}>Side bar</div>
    </div>
  );
}
