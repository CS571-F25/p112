import { Card, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

function SprintCard({ sprint }) {
  const taskCount = sprint.tasks?.length || 0;

  return (
    <Card className="h-100">
      <Card.Body>
        <Card.Title>{sprint.title}</Card.Title>
        {sprint.course && (
          <Card.Subtitle className="mb-2 text-muted">
            {sprint.course}
          </Card.Subtitle>
        )}
        {sprint.dueDate && (
          <Card.Text className="small mb-2">
            Due on {sprint.dueDate}
          </Card.Text>
        )}
        <Card.Text className="small mb-2">
          Focus window: {sprint.focusMinutes} minutes
        </Card.Text>
        <Card.Text className="small mb-3">
          <Badge bg="secondary">{taskCount} tasks</Badge>
        </Card.Text>
        <Card.Link as={Link} to={`/sprint/${sprint.id}`}>
          Open sprint
        </Card.Link>
      </Card.Body>
    </Card>
  );
}

export default SprintCard;
