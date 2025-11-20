import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

function JoinSprintPage() {
  const [code, setCode] = useState("");
  const [joined, setJoined] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    if (!code.trim()) return;
    setJoined(true);
  }

  return (
    <div>
      <h1 className="mb-3">Join a sprint</h1>
      <p className="text-muted mb-4">
        Type the short sprint code your friend shares with you. For now this is
        a demo, but it shows how the join flow will work.
      </p>

      <Form onSubmit={handleSubmit} style={{ maxWidth: "320px" }}>
        <Form.Group className="mb-3" controlId="joinCode">
          <Form.Label>Sprint code</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g. CS571-3A"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </Form.Group>
        <Button type="submit">Join sprint</Button>
      </Form>

      {joined && (
        <Alert variant="success" className="mt-3">
          You have joined sprint <strong>{code}</strong>. In the full app this
          page would show the shared timer and task list.
        </Alert>
      )}
    </div>
  );
}

export default JoinSprintPage;
