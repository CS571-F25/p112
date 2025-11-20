import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Row, Col, Card, Alert, Button } from "react-bootstrap";
import TimerPanel from "../components/TimerPanel.jsx";
import TaskList from "../components/TaskList.jsx";
import ReflectionPrompt from "../components/ReflectionPrompt.jsx";

function SprintDetailPage({ sprints }) {
  const { id } = useParams();
  const sprint = sprints.find((s) => s.id === id);
  const [reflection, setReflection] = useState(sprint?.reflection ?? "");

  if (!sprint) {
    return (
      <Alert variant="warning">
        We could not find that sprint. Go back to the{" "}
        <Alert.Link as={Link} to="/library">
          library
        </Alert.Link>{" "}
        or create a new one.
      </Alert>
    );
  }

  return (
    <section>
      <Row className="mb-3">
        <Col md={8}>
          <h2>{sprint.title}</h2>
          <p className="text-muted mb-1">
            {sprint.course && `${sprint.course} • `}
            {sprint.dueDate ? `Due ${sprint.dueDate}` : "No due date set"}
          </p>
          <p className="mb-0">
            Focus window: {sprint.focusMinutes} minutes
          </p>
        </Col>
        <Col md={4} className="text-md-end mt-3 mt-md-0">
          <Button as={Link} to="/library" variant="outline-secondary">
            Back to library
          </Button>
        </Col>
      </Row>

      <Row className="g-3">
        <Col md={5}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Timer</Card.Title>
              <TimerPanel focusMinutes={sprint.focusMinutes} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={7}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Tasks</Card.Title>
              <TaskList tasks={sprint.tasks} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col>
          <Card>
            <Card.Body>
              <ReflectionPrompt onChange={setReflection} />
              {reflection && (
                <p className="small text-muted mt-2 mb-0">
                  This reflection is stored locally for this sprint in this
                  browser only.
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </section>
  );
}

export default SprintDetailPage;
