import { useState, useEffect } from "react";
import styles from "../styles/DashBoard.module.css";
import LessonItem from "./LessonItem";
import TodayBoard from "./TodayBoard";

export default function MainContent({ activeTab }) {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch units chỉ 1 lần khi activeTab = "learning"
  useEffect(() => {
    if (activeTab === "learning" && units.length === 0) {
      setLoading(true);
      fetch("http://localhost:5000/api/units", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          setUnits(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [activeTab, units.length]);

  return (
    <div className={styles.dashBoard}>
      {activeTab === "today" && <TodayBoard />}

      {activeTab === "learning" && (
        <div className={styles.mainBoard}>
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : (
            units.map((unit) => (
              <section key={unit._id} className={styles.unit}>
                <header>
                  <div className={styles.weekCount}>
                    Tuần <span>{unit.index}</span>
                  </div>
                  <div className="flow">
                    <p>{unit.title}</p>
                    <h2>{unit.subTitle}</h2>
                  </div>
                  <img
                    src={"/" + unit.tag + ".png"}
                    alt="unit_icon"
                    className={styles.unit_img}
                  />
                </header>
                <hr />
                <div className={styles.lessonList}>
                  {unit.lessons.map((lesson, index) => (
                    <LessonItem
                      key={lesson._id}
                      index={lesson.index}
                      id={lesson._id}
                      lessonNumber={lesson.lessonNumber}
                      title={lesson.title}
                      description={lesson.description}
                      week={unit.index}
                      status={lesson.status}
                      icon={`/day${index + 1}.png`}
                    />
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      )}

      {activeTab === "learning" && <div className={styles.sideBar}></div>}
    </div>
  );
}
