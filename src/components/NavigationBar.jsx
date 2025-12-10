import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink, useLocation } from "react-router-dom";

function NavigationBar() {
  const location = useLocation();

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    // Base class for all links
    let classes = "nav-link d-flex align-items-center gap-2 px-2";
    
    if (isActive) {
      // Vibrant Cyan for active state
      classes += " text-info fw-bold";
    } else {
      // Bright White for inactive state (Force White)
      classes += " text-white";
    }
    return classes;
  };

  const getLinkStyle = (path) => {
    const isActive = location.pathname === path;
    if (isActive) {
      return { color: '#38bdf8 !important' }; // Cyan for active
    }
    return { color: '#ffffff !important' }; // White for inactive
  };

  return (
    <Navbar 
      variant="dark" 
      expand="lg" 
      fixed="top"
      className="py-3 border-bottom border-secondary" 
      style={{ backgroundColor: '#050505' }}
    >
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="fw-bold fs-4 text-white tracking-tight">
          Sprint Studio
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto gap-4 align-items-center">
            <Nav.Link 
              as={NavLink} 
              to="/new"
              className={getLinkClass('/new')}
              style={{
                color: location.pathname === '/new' ? '#38bdf8' : '#ffffff',
                textDecoration: 'none'
              }}
            >
              <i className="bi bi-plus-circle fs-5" style={{ color: location.pathname === '/new' ? '#38bdf8' : '#ffffff' }}></i>
              <span style={{ color: location.pathname === '/new' ? '#38bdf8' : '#ffffff' }}>New Sprint</span>
            </Nav.Link>
            
            <Nav.Link 
              as={NavLink} 
              to="/join"
              className={getLinkClass('/join')}
              style={{
                color: location.pathname === '/join' ? '#38bdf8' : '#ffffff',
                textDecoration: 'none'
              }}
            >
              <i className="bi bi-people fs-5" style={{ color: location.pathname === '/join' ? '#38bdf8' : '#ffffff' }}></i>
              <span style={{ color: location.pathname === '/join' ? '#38bdf8' : '#ffffff' }}>Join Sprint</span>
            </Nav.Link>
            
            <Nav.Link 
              as={NavLink} 
              to="/library"
              className={getLinkClass('/library')}
              style={{
                color: location.pathname === '/library' ? '#38bdf8' : '#ffffff',
                textDecoration: 'none'
              }}
            >
              <i className="bi bi-collection fs-5" style={{ color: location.pathname === '/library' ? '#38bdf8' : '#ffffff' }}></i>
              <span style={{ color: location.pathname === '/library' ? '#38bdf8' : '#ffffff' }}>Library</span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
