import { Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import MainNavbar from "./components/MainNavbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import NewSprintPage from "./pages/NewSprintPage.jsx";
import JoinSprintPage from "./pages/JoinSprintPage.jsx";
import LibraryPage from "./pages/LibraryPage.jsx";
import "./App.css";

function App() {
  return (
    <div className="app-bg">
      <MainNavbar />
      <Container className="py-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/new" element={<NewSprintPage />} />
          <Route path="/join" element={<JoinSprintPage />} />
          <Route path="/library" element={<LibraryPage />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
