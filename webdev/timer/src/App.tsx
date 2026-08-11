import { useState, useEffect } from "react";
import { Timer } from "./Components/Timer";
import { Stopwatch } from "./Components/Stopwatch";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState<"timer" | "stopwatch">("timer");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [isDarkMode]);

  return (
    <div className="google-widget-container">
      <div className="google-card">
        {/* Card Header Navigation Tabs */}
        <div className="google-card-header">
          <div className="google-tabs">
            <button
              type="button"
              className={`google-tab ${activeTab === "timer" ? "active" : ""}`}
              onClick={() => setActiveTab("timer")}
            >
              <svg className="tab-icon" viewBox="0 0 24 24" width="18" height="18">
                <path
                  fill="currentColor"
                  d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"
                />
              </svg>
              <span>Timer</span>
            </button>
            <button
              type="button"
              className={`google-tab ${activeTab === "stopwatch" ? "active" : ""}`}
              onClick={() => setActiveTab("stopwatch")}
            >
              <svg className="tab-icon" viewBox="0 0 24 24" width="18" height="18">
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"
                />
              </svg>
              <span>Stopwatch</span>
            </button>
          </div>

          <button
            type="button"
            className="theme-toggle-btn"
            title="Toggle Light/Dark Theme"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Tab Content */}
        <div className="google-card-body">
          <div className={`component-wrapper ${activeTab === "timer" ? "visible" : "hidden"}`}>
            <Timer />
          </div>
          <div className={`component-wrapper ${activeTab === "stopwatch" ? "visible" : "hidden"}`}>
            <Stopwatch />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

