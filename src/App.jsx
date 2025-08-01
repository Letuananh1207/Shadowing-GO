import React from "react";
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import "./App.css";

export default function App() {
  return (
    <div id="main">
      <Header />
      <main className="mainContent">
        <MainContent />
      </main>
    </div>
  );
}
