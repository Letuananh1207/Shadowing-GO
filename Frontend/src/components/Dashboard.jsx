import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainContent from "./MainContent";
import styles from "../styles/DashBoard.module.css";

export default function DashBoard({ tabIndex }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(
    tabIndex === 1 ? "today" : tabIndex === 2 ? "learning" : "today"
  );

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "today") navigate("/dashboard");
    else if (tab === "learning") navigate("/dashboard/inprogress");
  };

  return (
    <div>
      {/* ===== Greeting ===== */}
      <div className={styles.dashBoard_headBar}>
        <h1>Konnichiwa, Anh!</h1>

        {/* Tabbar */}
        <div className={styles.tabBar}>
          <button
            className={activeTab === "today" ? styles.activeTab : ""}
            onClick={() => handleTabClick("today")}
          >
            Today
          </button>
          <button
            className={activeTab === "learning" ? styles.activeTab : ""}
            onClick={() => handleTabClick("learning")}
          >
            Learning Path
          </button>
        </div>
      </div>

      <MainContent activeTab={activeTab} />
    </div>
  );
}
