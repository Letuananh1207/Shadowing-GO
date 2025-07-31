import React from "react";
import styles from "./Header.module.css";
import { Search, User } from "lucide-react";

export default function Header() {
  return (
    <header className={styles.header}>
      {/* Logo + Tên ứng dụng */}
      <div className={styles.logoWrapper}>
        <img
          src="/Maneki-Neko.png"
          alt="Shadowing GO Logo"
          className={styles.logoImage}
        />
        <span className={styles.appName}>Shadowing GO!</span>
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
          <User size={24} color="#6B4C57" strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}
