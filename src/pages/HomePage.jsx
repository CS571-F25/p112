import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <Container className="py-5">
      {/* Hero Section */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-white mb-3">Transform your workflow.</h1>
        <p className="lead text-white-50 mx-auto mb-4" style={{ maxWidth: "700px" }}>
          Deconstruct complex assignments into actionable sprints. Collaborate with
          peers in real-time and build a personalized library of successful strategies.
        </p>
        <Button 
          as={Link} 
          to="/new" 
          variant="info" 
          size="lg" 
          className="fw-bold px-4 text-dark"
        >
          Start a New Sprint
        </Button>
      </div>

      {/* Feature Grid */}
      <Row className="g-4">
        {/* Plan Card */}
        <Col md={4}>
          <Card className="h-100 border-secondary bg-dark text-white text-center p-4">
            <Card.Body>
              <div className="mb-3">
                <i className="bi bi-list-check text-info" style={{ fontSize: "2rem" }}></i>
              </div>
              <Card.Title className="fw-bold mb-3">Structured Focus</Card.Title>
              <Card.Text className="text-white-50 mb-4">
                Deconstruct complex assignments into actionable micro-tasks. Maintain
                momentum with dedicated focus windows.
              </Card.Text>
              <Button 
                as={Link} 
                to="/new" 
                variant="outline-info" 
                className="w-100 mt-auto"
              >
                Start Planning
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Sync Card */}
        <Col md={4}>
          <Card className="h-100 border-secondary bg-dark text-white text-center p-4">
            <Card.Body>
              <div className="mb-3">
                <i className="bi bi-people-fill text-primary" style={{ fontSize: "2rem" }}></i>
              </div>
              <Card.Title className="fw-bold mb-3">Shared Accountability</Card.Title>
              <Card.Text className="text-white-50 mb-4">
                Sync timers instantly with classmates via Sprint Codes. Create a shared
                digital environment that fosters discipline.
              </Card.Text>
              <Button 
                as={Link} 
                to="/join" 
                variant="outline-primary" 
                className="w-100 mt-auto"
              >
                Join Session
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Reflect Card */}
        <Col md={4}>
          <Card className="h-100 border-secondary bg-dark text-white text-center p-4">
            <Card.Body>
              <div className="mb-3">
                <i className="bi bi-journal-bookmark-fill text-warning" style={{ fontSize: "2rem" }}></i>
              </div>
              <Card.Title className="fw-bold mb-3">Retrospective Growth</Card.Title>
              <Card.Text className="text-white-50 mb-4">
                Capture insights after every session. Build a searchable repository of
                the strategies that work best for you.
              </Card.Text>
              <Button 
                as={Link} 
                to="/library" 
                variant="outline-warning" 
                className="w-100 mt-auto"
              >
                View Library
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
