import React from "react";
import styles from "../styles/Header.module.css";
import { Search, User } from "lucide-react";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        {/* Logo + Tên ứng dụng */}
        <div className={styles.logoWrapper}>
          <a href="/">
            <img
              src="/Maneki-Neko.png"
              alt="Shadowing GO Logo"
              className={styles.logoImage}
            />
          </a>

          <span className={styles.appName}>BeraBera jp</span>
        </div>

        {/* Search + Bell + User */}
        <div className={styles.iconGroup}>
          <button className={styles.iconButton} aria-label="Tìm kiếm">
            <Search size={24} color="#6B4C57" strokeWidth={2} />
          </button>

          <button className={styles.iconButton} aria-label="Thông báo">
            <img src="/bell.png" alt="Thông báo" width="24" height="24" />
          </button>

          <button className={styles.iconButton} aria-label="Tài khoản">
            <User
              size={24}
              color="#6B4C57"
              strokeWidth={2}
              onClick={() => {
                window.location.href = "http://localhost:5000/api/auth/google";
              }}
            />
          </button>
        </div>
      </div>
    </header>
  );
}
