import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import DashBoard from "./components/Dashboard";
import LessonPage from "./components/LessonPage";
import "./App.css";

export default function App() {
  return (
    <div id="main">
      <BrowserRouter>
        <Header />
        <main className="mainContent">
          <Routes>
            <Route path="/dashboard" element={<DashBoard tabIndex={1} />} />
            <Route
              path="/dashboard/inprogress"
              element={<DashBoard tabIndex={2} />}
            />
            <Route path="/learn/:id" element={<LessonPage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}
