import { useState, useEffect } from "react";
import styles from "../styles/DashBoard.module.css";
import LessonItem from "./LessonItem";
import TodayBoard from "./TodayBoard";
export default function MainContent() {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("today"); // tab mặc định là "today"

  // Chỉ fetch khi activeTab = "learning"
  useEffect(() => {
    if (activeTab === "learning") {
      setLoading(true);
      fetch("http://localhost:5000/api/units", {
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          setUnits(data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  }, [activeTab]);

  return (
    <div>
      <div className={styles.dashBoard_headBar}>
        <h1>Konnichiwa, Anh!</h1>

        {/* Tabbar */}
        <div className={styles.tabBar}>
          <button
            className={activeTab === "today" ? styles.activeTab : ""}
            onClick={() => setActiveTab("today")}
          >
            Today
          </button>
          <button
            className={activeTab === "learning" ? styles.activeTab : ""}
            onClick={() => setActiveTab("learning")}
          >
            Learning Path
          </button>
        </div>
      </div>

      <div className={styles.dashBoard}>
        <div className={styles.mainBoard}>
          {activeTab === "today" && <TodayBoard />}

          {activeTab === "learning" && (
            <>
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
                          index={lesson.index}
                          id={lesson._id}
                          lessonNumber={lesson.lessonNumber}
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
            </>
          )}
        </div>
        {activeTab === "learning" && <div className={styles.sideBar}></div>}
      </div>
    </div>
  );
}
