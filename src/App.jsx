import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import MainNavbar from "./components/MainNavbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import NewSprintPage from "./pages/NewSprintPage.jsx";
import JoinSprintPage from "./pages/JoinSprintPage.jsx";
import LibraryPage from "./pages/LibraryPage.jsx";
import SprintDetailPage from "./pages/SprintDetailPage.jsx";
import "./App.css";

function App() {
  const [sprints, setSprints] = useState(() => {
    try {
      const saved = localStorage.getItem("sprint-studio-data");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse local storage", e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("sprint-studio-data", JSON.stringify(sprints));
  }, [sprints]);

  const addSprint = (newSprint) => {
    setSprints((prev) => [...prev, newSprint]);
  };

  const updateSprint = (id, data) => {
    setSprints((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } : s))
    );
  };

  const deleteSprint = (id) => {
    setSprints((prev) => prev.filter((s) => s.id !== id));
  };

  const clearSprints = (status) => {
    if (status === 'all') {
      if (window.confirm("Are you sure you want to delete ALL sprints? This cannot be undone.")) {
        setSprints([]);
      }
    } else {
      if (window.confirm(`Are you sure you want to clear all ${status === 'active' ? 'in-progress' : 'completed'} sprints?`)) {
        setSprints((prev) => prev.filter((s) => s.status !== status));
      }
    }
  };

  return (
    <div className="app-bg">
      <MainNavbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/new"
          element={<NewSprintPage addSprint={addSprint} />}
        />
        <Route path="/join" element={<JoinSprintPage />} />
        <Route
          path="/library"
          element={
            <LibraryPage 
              sprints={sprints} 
              deleteSprint={deleteSprint} 
              clearSprints={clearSprints}
            />
          }
        />
        <Route
          path="/sprint/:sprintId"
          element={
            <SprintDetailPage
              sprints={sprints}
              updateSprint={updateSprint}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
