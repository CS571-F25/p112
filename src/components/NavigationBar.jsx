import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";

function NavigationBar() {
  return (
    <Navbar bg="dark" variant="dark" expand="md" fixed="top">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          Sprint Studio
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/create">
              New sprint
            </Nav.Link>
            <Nav.Link as={NavLink} to="/join">
              Join sprint
            </Nav.Link>
            <Nav.Link as={NavLink} to="/library">
              Library
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
