import { Row, Col, Card } from "react-bootstrap";

const mockReflections = [
  {
    id: 1,
    title: "CS571 – Web project",
    note: "Writing tasks the night before made it stressful. Breaking it into 25-minute sprints felt lighter.",
    tag: "Planning"
  },
  {
    id: 2,
    title: "Math midterm review",
    note: "Explaining problems out loud to a friend helped more than rereading notes.",
    tag: "Study strategy"
  },
  {
    id: 3,
    title: "History essay",
    note: "Starting with a messy outline removed the block. Perfect sentences came later.",
    tag: "Overcoming block"
  }
];

function LibraryPage() {
  return (
    <div>
      <h1 className="mb-3">Reflection library</h1>
      <p className="text-muted mb-4">
        After each sprint the app will save a small card with what worked. This
        page shows an example of how those cards can look.
      </p>

      <Row className="g-4">
        {mockReflections.map((card) => (
          <Col md={4} key={card.id}>
            <Card bg="dark" text="light" className="h-100">
              <Card.Body>
                <Card.Subtitle className="mb-2 text-info">
                  {card.tag}
                </Card.Subtitle>
                <Card.Title>{card.title}</Card.Title>
                <Card.Text>{card.note}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default LibraryPage;
