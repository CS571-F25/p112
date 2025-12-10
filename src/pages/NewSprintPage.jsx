import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import TaskList from "../components/TaskList.jsx";
import PageContainer from "../components/PageContainer.jsx";
import TaskStepsModal from "../components/TaskStepsModal.jsx";

function NewSprintPage({ addSprint }) {
  const navigate = useNavigate();
  const [assignmentName, setAssignmentName] = useState("");
  const [courseCategory, setCourseCategory] = useState("");
  
  // Resource state
  const [resources, setResources] = useState([]);
  const [tempLinkName, setTempLinkName] = useState("");
  const [tempLinkUrl, setTempLinkUrl] = useState("");
  
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [taskText, setTaskText] = useState("");
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  
  // Modal state
  const [showStepsModal, setShowStepsModal] = useState(false);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);

  const QUICK_TIMES = [10, 20, 30, 40, 50, 60];

  function handleAddResource() {
    if (!tempLinkName.trim() || !tempLinkUrl.trim()) return;
    
    setResources(prev => [
      ...prev, 
      { 
        id: Date.now().toString(), 
        name: tempLinkName.trim(), 
        url: tempLinkUrl.trim() 
      }
    ]);
    
    setTempLinkName("");
    setTempLinkUrl("");
  }

  function handleRemoveResource(id) {
    setResources(prev => prev.filter(r => r.id !== id));
  }

  function handleAddTask(e) {
    if (e) e.preventDefault();
    const trimmed = taskText.trim();
    if (!trimmed) return;
    setTasks((prev) => [...prev, { text: trimmed, steps: [] }]);
    setTaskText("");
  }

  function handleRemoveTask(index) {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  }

  function handleClearTasks() {
    if (window.confirm("Are you sure you want to clear all tasks?")) {
      setTasks([]);
    }
  }

  function handleMoveTask(index, direction) {
    setTasks((prev) => {
      const newTasks = [...prev];
      if (direction === -1 && index === 0) return prev;
      if (direction === 1 && index === newTasks.length - 1) return prev;

      const targetIndex = index + direction;
      const temp = newTasks[index];
      newTasks[index] = newTasks[targetIndex];
      newTasks[targetIndex] = temp;
      
      return newTasks;
    });
  }

  function handleEditSteps(index) {
    setSelectedTaskIndex(index);
    setShowStepsModal(true);
  }

  function handleSaveSteps(newSteps) {
    if (selectedTaskIndex === null) return;
    
    setTasks((prev) => {
      const newTasks = [...prev];
      newTasks[selectedTaskIndex] = { 
        ...newTasks[selectedTaskIndex], 
        steps: newSteps 
      };
      return newTasks;
    });
  }

  function handleStartSprint() {
    if (!assignmentName.trim()) {
      setError("Please name your assignment or sprint.");
      return;
    }

    const finalMinutes = Number(focusMinutes) || 25;

    const newSprint = {
      id: Date.now().toString(),
      title: assignmentName.trim(),
      course: courseCategory.trim(),
      resources: resources, // Save the array of resources
      focusMinutes: finalMinutes,
      tasks: tasks,
      status: "active",
      createdAt: new Date().toISOString(),
      reflection: "",
    };

    addSprint(newSprint);
    navigate(`/sprint/${newSprint.id}`);
  }

  const handleFocusChange = (e) => {
    const val = e.target.value;
    if (val === "") {
      setFocusMinutes("");
      return;
    }
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 0) {
      setFocusMinutes(num);
    }
  };

  const sprintTitle = assignmentName.trim() || "Untitled sprint";
  const displayMinutes = Number(focusMinutes) || 0;

  return (
    <PageContainer title="Start a new sprint">
      <p className="mb-5 lead">
        Name the assignment, choose a focus window, and add a few short tasks you
        want to finish this session.
      </p>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col md={7} className="mb-4">
          <Form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            {/* Assignment name */}
            <Form.Group className="mb-4" controlId="sprintName">
              <Form.Label className="fw-semibold">
                Assignment or sprint name
              </Form.Label>
              <Form.Control
                type="text"
                value={assignmentName}
                onChange={(e) => {
                  setAssignmentName(e.target.value);
                  setError("");
                }}
                placeholder="CS571 project milestone"
              />
            </Form.Group>

            {/* Resources Section */}
            <Form.Group className="mb-4" controlId="resources">
              <Form.Label className="fw-semibold">
                Add Resources (Links Only - Google Drive, Notion, Canvas, etc.)
              </Form.Label>
              <Row className="g-2">
                <Col md={4}>
                  <Form.Control
                    type="text"
                    placeholder="Link Name (e.g. Essay Doc)"
                    value={tempLinkName}
                    onChange={(e) => setTempLinkName(e.target.value)}
                    className="bg-dark text-white border-secondary placeholder-light"
                  />
                </Col>
                <Col md={6}>
                  <Form.Control
                    type="text"
                    placeholder="URL (e.g. docs.google.com...)"
                    value={tempLinkUrl}
                    onChange={(e) => setTempLinkUrl(e.target.value)}
                    className="bg-dark text-white border-secondary placeholder-light"
                  />
                </Col>
                <Col md={2}>
                  <Button 
                    variant="outline-info" 
                    className="w-100"
                    onClick={handleAddResource}
                    disabled={!tempLinkName.trim() || !tempLinkUrl.trim()}
                  >
                    Add
                  </Button>
                </Col>
              </Row>
              <Form.Text className="text-muted d-block mb-2">
                Files cannot be uploaded. Please use links to cloud documents.
              </Form.Text>

              {/* Added Resources List */}
              {resources.length > 0 && (
                <div className="mt-2 d-flex flex-wrap gap-2">
                  {resources.map((res) => (
                    <div 
                      key={res.id} 
                      className="d-flex align-items-center bg-dark border border-secondary rounded px-3 py-1"
                    >
                      <span className="me-2 text-info">🔗</span>
                      <span className="me-2 text-light">{res.name}</span>
                      <Button 
                        variant="link" 
                        className="text-danger p-0 text-decoration-none" 
                        size="sm"
                        onClick={() => handleRemoveResource(res.id)}
                        aria-label={`Remove resource ${res.name}`}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Form.Group>

            {/* Course or Category */}
            <Form.Group className="mb-4" controlId="courseCategory">
              <Form.Label className="fw-semibold">
                Course or Category
              </Form.Label>
              <Form.Control
                type="text"
                value={courseCategory}
                onChange={(e) => setCourseCategory(e.target.value)}
                placeholder="e.g. CS571, Personal, Math"
              />
            </Form.Group>

            {/* Focus window */}
            <Form.Group className="mb-4" controlId="focusWindow">
              <Form.Label className="fw-semibold">
                Focus window (minutes)
              </Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="180"
                value={focusMinutes}
                onChange={handleFocusChange}
              />
              <div className="d-flex gap-2 mt-2 flex-wrap">
                {QUICK_TIMES.map((time) => (
                  <Button
                    key={time}
                    variant={Number(focusMinutes) === time ? "info" : "outline-secondary"}
                    size="sm"
                    className={Number(focusMinutes) === time ? "text-dark fw-bold" : "text-light"}
                    onClick={() => setFocusMinutes(time)}
                  >
                    {time}m
                  </Button>
                ))}
              </div>
            </Form.Group>

            {/* Short tasks */}
            <Form.Group className="mb-4" controlId="taskInput">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label className="fw-semibold mb-0">Add a short task</Form.Label>
                {tasks.length > 0 && (
                  <Button 
                    variant="link" 
                    className="text-danger p-0 text-decoration-none small fs-6" 
                    onClick={handleClearTasks}
                  >
                    Clear All
                  </Button>
                )}
              </div>
              <div className="d-flex gap-2">
                <Form.Control
                  type="text"
                  value={taskText}
                  onChange={(e) => setTaskText(e.target.value)}
                  placeholder="Draft intro paragraph"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTask();
                    }
                  }}
                />
                <Button
                  variant="primary"
                  onClick={handleAddTask}
                  style={{
                    backgroundColor: "#38bdf8",
                    color: "#000",
                    border: "none",
                  }}
                >
                  Add
                </Button>
              </div>
              <Form.Text className="text-muted">
                Keep tasks small so they feel easy to start.
              </Form.Text>
            </Form.Group>

            <div className="mt-5">
              <Button
                size="lg"
                onClick={handleStartSprint}
                style={{
                  backgroundColor: "#38bdf8",
                  color: "#000",
                  border: "none",
                }}
              >
                Start Sprint
              </Button>
            </div>
          </Form>
        </Col>

        {/* Preview column */}
        <Col md={5}>
          <Card bg="dark" text="light" className="border-0">
            <Card.Body>
              <h2 className="h4 mb-3 d-flex justify-content-between align-items-center">
                Sprint preview
                {tasks.length > 0 && (
                  <Button 
                    variant="link" 
                    className="text-danger p-0 text-decoration-none small fs-6" 
                    onClick={handleClearTasks}
                  >
                    Clear All
                  </Button>
                )}
              </h2>
              <p className="mb-1">
                <span className="fw-semibold">Title:</span> {sprintTitle}
              </p>
              <p className="mb-1">
                <span className="fw-semibold">Course:</span> {courseCategory || "Not set"}
              </p>
              <p className="mb-3">
                <span className="fw-semibold">Focus window:</span>{" "}
                {displayMinutes} minutes
              </p>
              
              {/* Preview Resources */}
              {resources.length > 0 && (
                <div className="mb-3">
                  <p className="fw-semibold mb-2">Resources:</p>
                  <ul className="list-unstyled mb-0">
                    {resources.map(res => (
                      <li key={res.id} className="text-info small mb-1">
                        🔗 {res.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="fw-semibold mb-2">Tasks:</p>
              <TaskList 
                tasks={tasks} 
                onRemove={handleRemoveTask}
                onMove={handleMoveTask}
                onEditSteps={handleEditSteps}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <TaskStepsModal 
        show={showStepsModal}
        onHide={() => setShowStepsModal(false)}
        task={selectedTaskIndex !== null ? tasks[selectedTaskIndex] : null}
        onSave={handleSaveSteps}
      />
    </PageContainer>
  );
}

export default NewSprintPage;
