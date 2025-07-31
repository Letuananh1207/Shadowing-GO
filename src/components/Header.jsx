import React from "react";

export default function Header() {
  return (
    <header
      style={{
        backgroundColor: "#FEFEFE",
        padding: "1rem 2rem",
        borderBottom: "1px solid #FFB3BA",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Logo + Tên ứng dụng */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <img
          src="/Maneki-Neko.png"
          alt="Shadowing GO Logo"
          style={{
            width: "40px",
            height: "40px",
            objectFit: "contain",
          }}
        />
        <span
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#FF5722",
            letterSpacing: "0.5px",
          }}
        >
          Shadowing GO!
        </span>
      </div>

      {/* Menu đơn giản */}
      <nav>
        <ul
          style={{
            listStyle: "none",
            display: "flex",
            gap: "1.5rem",
            margin: 0,
            padding: 0,
          }}
        >
          {["Trang chủ", "Khóa học", "Tính năng", "Liên hệ"].map((item) => (
            <li key={item}>
              <a
                href="#"
                style={{
                  textDecoration: "none",
                  color: "#6B4C57",
                  fontWeight: 500,
                  transition: "color 0.2s",
                }}
                onMouseOver={(e) => (e.target.style.color = "#FF5722")}
                onMouseOut={(e) => (e.target.style.color = "#6B4C57")}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
