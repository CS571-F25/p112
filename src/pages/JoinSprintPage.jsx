import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PageContainer from "../components/PageContainer.jsx";

function JoinSprintPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    const trimmedCode = code.trim();
    if (!trimmedCode) return;

    try {
      const saved = localStorage.getItem("sprint-studio-data");
      const sprints = saved ? JSON.parse(saved) : [];
      const found = sprints.find((s) => s.id === trimmedCode);

      if (found) {
        // Sprint found locally
        navigate(`/sprint/${found.id}`);
      } else {
        // Sprint not found locally - Simulate Joining a Remote Session
        // In a real app, this would fetch from a backend.
        // Here, we create a local "mirror" of the session.
        const syncedSprint = {
          id: trimmedCode,
          title: `Group Sprint [${trimmedCode}]`,
          focusMinutes: 25, // Default for synced sessions
          tasks: ["Synced session - Add your tasks here"],
          status: "active",
          createdAt: new Date().toISOString(),
          reflection: "",
          isSynced: true // Flag to indicate this is a joined session
        };

        // Add to local storage
        sprints.push(syncedSprint);
        localStorage.setItem("sprint-studio-data", JSON.stringify(sprints));

        // Redirect with a slight delay to allow state propagation if needed (though navigating immediately works with localStorage)
        // Ideally, we'd use the addSprint context function, but direct localStorage manipulation works for this simulation.
        // Note: For full correctness without page reload issues, we rely on the App component re-reading or simple navigation
        // since we are modifying localStorage directly here, we might need to trigger a reload or use the prop if available.
        // However, the instructions imply simulating the logic here.
        
        // To ensure the App component picks up the change if we were using state there, 
        // we'd strictly need the addSprint prop. Since we don't have it passed here in the previous step,
        // we will assume the App re-renders or we force a window location change or just navigate.
        // React Router navigation doesn't reset App state automatically if it's held in memory.
        // But let's follow the instruction: "Create a new sprint object in localStorage... Navigate them."
        
        // *CRITICAL*: Since App.jsx initializes from localStorage on mount, but doesn't listen to storage events from the same window,
        // we should really use the addSprint prop. 
        // But since I cannot easily change App.jsx signature right now without breaking the flow, 
        // I will force a reload to ensure state consistency or rely on the user refreshing if they don't see it.
        // Actually, let's just write to localStorage and navigate. 
        // *Better approach*: We can't easily access setSprints from here without prop drilling. 
        // I will implement the localStorage write and then force a full page load to /sprint/:id to ensure App state re-inits.
        
        window.location.href = `#/sprint/${trimmedCode}`;
        window.location.reload(); 
      }
    } catch (e) {
      setError("An error occurred while joining the session.");
      console.error(e);
    }
  }

  return (
    <PageContainer title="Join a sprint">
      <p className="text-muted mb-4">
        Enter a sprint code to join a friend's session.
      </p>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit} style={{ maxWidth: "320px" }}>
        <Form.Group className="mb-3" controlId="joinCode">
          <Form.Label>Sprint code</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g. 173385..."
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError("");
            }}
          />
          <Form.Text className="text-muted">
             Joining a sync session starts your own timer alongside your group.
          </Form.Text>
        </Form.Group>
        <Button 
          type="submit"
          style={{
            backgroundColor: "#38bdf8",
            color: "#000",
            border: "none",
          }}
        >
          Join Session
        </Button>
      </Form>
    </PageContainer>
  );
}

export default JoinSprintPage;
