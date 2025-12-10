import { useState, useMemo } from "react";
import { Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import SprintCard from "../components/SprintCard.jsx";
import PageContainer from "../components/PageContainer.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ReflectionModal from "../components/ReflectionModal.jsx";

function LibraryPage({ sprints, deleteSprint, clearSprints, updateSprint }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  // Extract unique categories for the datalist
  const categories = useMemo(() => {
    const cats = new Set(sprints.map(s => s.course).filter(Boolean));
    return Array.from(cats);
  }, [sprints]);

  // Filter sprints based on fuzzy search
  const filteredSprints = useMemo(() => {
    let result = sprints;
    
    // Apply filter
    if (filterCategory && filterCategory !== "All") {
      const lowerFilter = filterCategory.toLowerCase();
      result = result.filter(s => 
        s.course && s.course.toLowerCase().includes(lowerFilter)
      );
    }

    // Apply sort
    return [...result].sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === "name") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [sprints, filterCategory, sortBy]);

  const activeSprints = filteredSprints.filter((s) => s.status === "active");
  const completedSprints = filteredSprints.filter((s) => s.status === "completed");

  const hasItems = activeSprints.length > 0 || completedSprints.length > 0;

  const handleViewReflection = (sprint) => {
    setSelectedSprint(sprint);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this sprint?")) {
      deleteSprint(id);
    }
  };

  // Wrapper for update that also refreshes the selected sprint in the modal
  const handleUpdate = (id, data) => {
    if (updateSprint) {
      updateSprint(id, data);
      
      // If the updated sprint is the one currently viewing, update the local state too
      if (selectedSprint && selectedSprint.id === id) {
        setSelectedSprint(prev => ({ ...prev, ...data }));
      }
    }
  };

  if (sprints.length === 0) {
    return (
      <PageContainer title="Reflection library">
        <EmptyState message="No sprints yet">
          <p className="text-muted mb-4">
            Start a sprint to begin building your library.
          </p>
          <Button
            as={Link}
            to="/new"
            style={{
              backgroundColor: "#38bdf8",
              color: "#000",
              border: "none",
            }}
          >
            Start a sprint
          </Button>
        </EmptyState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Row className="align-items-center mb-4 g-3">
        <Col md={6}>
          <h1 className="h2 mb-0 fw-bold">Reflection library</h1>
        </Col>
        <Col md={6}>
          <div className="d-flex gap-2 justify-content-md-end">
            <Form.Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-dark text-light border-secondary"
              style={{ maxWidth: '150px' }}
              aria-label="Sort sprints"
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="name">Name (A-Z)</option>
            </Form.Select>

            <div style={{ maxWidth: '250px', width: '100%' }}>
              <InputGroup>
                <InputGroup.Text className="bg-dark text-secondary border-secondary">
                  🔍
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  list="category-options"
                  placeholder="Type to filter categories..."
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  aria-label="Filter sprints by category"
                  className="bg-dark text-light border-secondary border-start-0"
                />
              </InputGroup>
              <datalist id="category-options">
                <option value="All" />
                {categories.map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
          </div>
        </Col>
      </Row>

      {!hasItems && (
        <p className="text-muted">No sprints found matching "{filterCategory}".</p>
      )}

      {activeSprints.length > 0 && (
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h4 mb-0 text-info">In Progress</h2>
            {clearSprints && (
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={() => clearSprints('active')}
              >
                Clear List
              </Button>
            )}
          </div>
          <Row className="g-4">
            {activeSprints.map((sprint) => (
              <Col md={4} key={sprint.id}>
                <div className="h-100 position-relative">
                  <SprintCard 
                    sprint={sprint} 
                    actionLabel="Continue"
                    actionStyle={{
                      backgroundColor: "#38bdf8",
                      color: "#000",
                      border: "none",
                    }}
                    onDelete={handleDelete}
                  />
                </div>
              </Col>
            ))}
          </Row>
        </section>
      )}

      {completedSprints.length > 0 && (
        <section>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h4 mb-0">Past Reflections</h2>
            {clearSprints && (
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={() => clearSprints('completed')}
              >
                Clear List
              </Button>
            )}
          </div>
          <Row className="g-4">
            {completedSprints.map((sprint) => (
              <Col md={4} key={sprint.id}>
                <SprintCard 
                  sprint={sprint}
                  onView={handleViewReflection}
                  onDelete={handleDelete}
                />
              </Col>
            ))}
          </Row>
        </section>
      )}

      <ReflectionModal 
        show={showModal}
        onHide={() => setShowModal(false)}
        sprint={selectedSprint}
        onUpdate={handleUpdate}
      />
    </PageContainer>
  );
}

export default LibraryPage;
