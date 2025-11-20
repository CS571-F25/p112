import { Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div>
      <h1 className="mb-3">Sprint Studio</h1>
      <p className="lead mb-4">
        Turn big assignments into short, focused work sessions. Plan your
        sprint, work alongside friends, and save quick reflections so the next
        assignment feels easier.
      </p>

      <Row className="g-4">
        <Col md={4}>
          <Card bg="dark" text="light" className="h-100">
            <Card.Body>
              <Card.Title>Plan small, win often</Card.Title>
              <Card.Text>
                Break one assignment into short tasks and focus windows so you
                do not wait until the night before it is due.
              </Card.Text>
              <Button as={Link} to="/new" variant="primary">
                Start a sprint
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card bg="dark" text="light" className="h-100">
            <Card.Body>
              <Card.Title>Work with friends</Card.Title>
              <Card.Text>
                Share a sprint code so classmates can join the same session
                from their own laptops.
              </Card.Text>
              <Button as={Link} to="/join" variant="outline-light">
                Join with a code
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card bg="dark" text="light" className="h-100">
            <Card.Body>
              <Card.Title>Save what worked</Card.Title>
              <Card.Text>
                After each sprint, keep a small reflection card with what
                helped you learn. Build a personal library over time.
              </Card.Text>
              <Button as={Link} to="/library" variant="outline-light">
                View your library
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default HomePage;
