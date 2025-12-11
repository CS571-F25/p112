import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Row, Col, Card, Alert, Button, OverlayTrigger, Tooltip, Form, ProgressBar, InputGroup } from "react-bootstrap";
import TimerPanel from "../components/TimerPanel.jsx";
import TaskList from "../components/TaskList.jsx";
import ReflectionPrompt from "../components/ReflectionPrompt.jsx";
import PageContainer from "../components/PageContainer.jsx";
import SprintHeader from "../components/SprintHeader.jsx";
import TaskStepsModal from "../components/TaskStepsModal.jsx";

function SprintDetailPage({ sprints, updateSprint }) {
  const { sprintId } = useParams();
  const navigate = useNavigate();
  const sprint = sprints.find((s) => s.id === sprintId);

  const [reflection, setReflection] = useState(sprint?.reflection ?? "");
  const [showReflection, setShowReflection] = useState(false);
  
  // Track current timer state for task timing
  const [secondsRemaining, setSecondsRemaining] = useState(null);

  // Title Editing State
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(sprint?.title || "");

  // Resource Editing State
  const [showAddResource, setShowAddResource] = useState(false);
  const [newResName, setNewResName] = useState("");
  const [newResUrl, setNewResUrl] = useState("");

  // Modal state for editing steps
  const [showStepsModal, setShowStepsModal] = useState(false);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);

  // Sprint code copy state
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (sprint) {
      setReflection(sprint.reflection || "");
      if (!isEditingTitle) {
        setTempTitle(sprint.title);
      }
      // Initialize secondsRemaining if not set
      if (secondsRemaining === null && sprint.focusMinutes) {
        setSecondsRemaining(sprint.focusMinutes * 60);
      }
    }
  }, [sprint, isEditingTitle, secondsRemaining]);

  if (!sprint) {
    return (
      <PageContainer>
        <Alert variant="warning">
          We could not find that sprint. Go back to the{" "}
          <Alert.Link as={Link} to="/library">
            library
          </Alert.Link>{" "}
          or create a new one.
        </Alert>
      </PageContainer>
    );
  }

  const handleTimerComplete = () => {
    setShowReflection(true);
  };

  const handleCompleteSprint = () => {
    updateSprint(sprint.id, {
      reflection,
      status: "completed",
      completedAt: new Date().toISOString(),
    });
    navigate("/library");
  };

  const handleTimerTick = (currentSeconds) => {
    setSecondsRemaining(currentSeconds);
  };

  // Helper to ensure links open correctly
  const formatUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `https://${url}`;
  };

  const renderResourceTooltip = (props) => (
    <Tooltip id="resource-tooltip" {...props}>
      Open the link attached to this sprint.
    </Tooltip>
  );

  // Live Task Management Handlers
  const handleMoveTask = (index, direction) => {
    const newTasks = [...sprint.tasks];
    if (direction === -1 && index === 0) return;
    if (direction === 1 && index === newTasks.length - 1) return;

    const targetIndex = index + direction;
    const temp = newTasks[index];
    newTasks[index] = newTasks[targetIndex];
    newTasks[targetIndex] = temp;
    
    updateSprint(sprint.id, { tasks: newTasks });
  };

  const handleRemoveTask = (index) => {
    const newTasks = sprint.tasks.filter((_, i) => i !== index);
    updateSprint(sprint.id, { tasks: newTasks });
  };

  const handleEditTask = (index, newText) => {
    const newTasks = [...sprint.tasks];
    const task = newTasks[index];
    
    // Ensure object structure
    if (typeof task === 'string') {
      newTasks[index] = { text: newText, steps: [] };
    } else {
      newTasks[index] = { ...task, text: newText };
    }
    
    updateSprint(sprint.id, { tasks: newTasks });
  };

  const handleCompleteTask = (index) => {
    const newTasks = [...sprint.tasks];
    const task = newTasks[index];
    
    const isNowCompleted = !(typeof task === 'object' && task.completed);

    if (isNowCompleted) {
        // Calculate ELAPSED time spent
        let formattedTime = "0m 0s";
        const currentSecondsLeft = secondsRemaining !== null ? secondsRemaining : (sprint.focusMinutes * 60);
        
        if (sprint.focusMinutes) {
          const totalSeconds = sprint.focusMinutes * 60;
          const elapsedSeconds = Math.max(0, totalSeconds - currentSecondsLeft);
          
          const m = Math.floor(elapsedSeconds / 60);
          const s = elapsedSeconds % 60;
          formattedTime = `${m}m ${s}s`;
        }

        // Mark as completed
        if (typeof task === 'string') {
            newTasks[index] = { 
                text: task, 
                steps: [], 
                completed: true, 
                completionTime: formattedTime 
            };
        } else {
            newTasks[index] = { 
                ...task, 
                completed: true, 
                completionTime: formattedTime 
            };
        }
    } else {
        // Un-complete (Undo)
        if (typeof task === 'object') {
            newTasks[index] = {
                ...task,
                completed: false,
                completionTime: null
            };
        }
    }

    updateSprint(sprint.id, { tasks: newTasks });
  };
  
  const handleAddTask = () => {
    const newTask = { text: "New Task", steps: [], completed: false };
    const newTasks = [...sprint.tasks, newTask];
    updateSprint(sprint.id, { tasks: newTasks });
  };

  // Enable editing steps during the sprint
  const handleEditSteps = (index) => {
    setSelectedTaskIndex(index);
    setShowStepsModal(true);
  };

  const handleSaveSteps = (newSteps) => {
    if (selectedTaskIndex === null) return;
    
    // Create a new tasks array with updated steps for the specific task
    const updatedTasks = [...sprint.tasks];
    
    // Handle potential legacy string tasks by converting to object
    const currentTask = updatedTasks[selectedTaskIndex];
    const taskText = typeof currentTask === 'string' ? currentTask : currentTask.text;
    
    updatedTasks[selectedTaskIndex] = {
      text: taskText,
      steps: newSteps
    };

    // Save directly to localStorage via updateSprint
    updateSprint(sprint.id, { tasks: updatedTasks });
  };

  // Title Editing Handlers
  const handleTitleSave = () => {
    if (tempTitle.trim()) {
      updateSprint(sprint.id, { title: tempTitle.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    }
  };

  // Sprint Code Copy Handler
  const handleCopyCode = () => {
    navigator.clipboard.writeText(sprint.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderCodeTooltip = (props) => (
    <Tooltip id="copy-code-tooltip" {...props}>
      Copy Sprint ID to clipboard to share with friends.
    </Tooltip>
  );

  // Resource Editing Handlers
  const handleRemoveResource = (resourceId) => {
    // Handle both array and legacy link scenarios
    if (resourceId === 'legacy') {
      updateSprint(sprint.id, { resourceLink: "" });
    } else {
      const updatedResources = (sprint.resources || []).filter(r => r.id !== resourceId);
      updateSprint(sprint.id, { resources: updatedResources });
    }
  };

  const handleAddResource = () => {
    if (!newResName.trim() || !newResUrl.trim()) return;
    
    const newResource = {
      id: Date.now().toString(),
      name: newResName.trim(),
      url: newResUrl.trim()
    };

    const currentResources = sprint.resources || [];
    updateSprint(sprint.id, { resources: [...currentResources, newResource] });
    
    setNewResName("");
    setNewResUrl("");
    setShowAddResource(false);
  };

  // Prepare resource list for display (merging legacy and new)
  const displayResources = sprint.resources || [];
  const hasLegacy = sprint.resourceLink && sprint.resourceLink.trim() !== "";

  // Progress Bar Calculation
  const totalTasks = sprint.tasks.length;
  const completedTasks = sprint.tasks.filter(t => typeof t === 'object' && t.completed).length;
  const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <PageContainer>
      {/* Editable Header Area */}
      <div className="mb-4">
        <Row className="align-items-center">
          <Col md={7}>
            {isEditingTitle ? (
              <Form.Group className="mb-2">
                <Form.Control 
                  autoFocus
                  type="text" 
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={handleTitleKeyDown}
                  className="bg-dark text-light border-info fs-2 fw-bold"
                />
                <Form.Text className="text-muted">Press Enter to save</Form.Text>
              </Form.Group>
            ) : (
              <h2 
                className="mb-1 d-flex align-items-center gap-2 cursor-pointer hover-opacity"
                onClick={() => setIsEditingTitle(true)}
                title="Click to rename sprint"
                style={{ cursor: 'pointer' }}
              >
                {sprint.title}
                <span className="text-muted fs-6 fw-normal">✎</span>
              </h2>
            )}
            
            <p className="text-muted mb-0">
              {sprint.course && `${sprint.course} • `}
              Focus Window: {sprint.focusMinutes} min
            </p>
          </Col>
          <Col md={5} className="mt-3 mt-md-0 d-flex justify-content-end">
            <InputGroup size="sm" style={{ maxWidth: '250px' }}>
              <InputGroup.Text className="bg-dark text-muted border-secondary">Code</InputGroup.Text>
              <Form.Control 
                readOnly 
                value={sprint.id} 
                className="bg-dark text-light border-secondary font-monospace"
                style={{ fontSize: '0.85rem' }}
              />
              <OverlayTrigger
                placement="bottom"
                overlay={renderCodeTooltip}
              >
                <Button 
                  variant="outline-secondary" 
                  onClick={handleCopyCode}
                  title="Copy Code"
                >
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </OverlayTrigger>
            </InputGroup>
          </Col>
        </Row>
      </div>

      {/* Editable Resources Section */}
      <div className="mb-4">
        <div className="d-flex flex-wrap gap-2 align-items-center">
          {displayResources.map(res => (
            <div key={res.id} className="d-flex align-items-center">
              <OverlayTrigger placement="top" overlay={renderResourceTooltip}>
                <Button 
                  href={formatUrl(res.url)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  variant="outline-info"
                  size="lg"
                  className="fw-bold d-flex align-items-center gap-2"
                  style={{ border: '2px solid #38bdf8', borderRight: 'none', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                >
                  <span>🔗</span> {res.name}
                </Button>
              </OverlayTrigger>
              <Button 
                variant="outline-danger" 
                size="lg"
                className="d-flex align-items-center"
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderLeft: 'none' }}
                onClick={() => handleRemoveResource(res.id)}
                title="Remove link"
              >
                ×
              </Button>
            </div>
          ))}

          {hasLegacy && (
            <div className="d-flex align-items-center">
              <OverlayTrigger placement="top" overlay={renderResourceTooltip}>
               <Button 
                href={formatUrl(sprint.resourceLink)} 
                target="_blank" 
                rel="noopener noreferrer"
                variant="outline-info"
                size="lg"
                className="fw-bold d-flex align-items-center gap-2"
                style={{ border: '2px solid #38bdf8', borderRight: 'none', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
              >
                <span>📄</span> Open Assignment Resource
              </Button>
              </OverlayTrigger>
              <Button 
                variant="outline-danger" 
                size="lg"
                className="d-flex align-items-center"
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderLeft: 'none' }}
                onClick={() => handleRemoveResource('legacy')}
                title="Remove link"
              >
                ×
              </Button>
            </div>
          )}

          {/* Add Resource Button */}
          {!showAddResource ? (
            <Button 
              variant="outline-secondary" 
              size="sm" 
              className="ms-2"
              onClick={() => setShowAddResource(true)}
            >
              + Add Link
            </Button>
          ) : (
            <div className="d-flex gap-2 align-items-center bg-dark border border-secondary p-2 rounded ms-2">
              <Form.Control 
                size="sm" 
                placeholder="Name" 
                value={newResName}
                onChange={(e) => setNewResName(e.target.value)}
                className="bg-dark text-light border-secondary"
                style={{ width: '120px' }}
              />
              <Form.Control 
                size="sm" 
                placeholder="URL" 
                value={newResUrl}
                onChange={(e) => setNewResUrl(e.target.value)}
                className="bg-dark text-light border-secondary"
                style={{ width: '150px' }}
              />
              <Button size="sm" variant="info" onClick={handleAddResource}>Save</Button>
              <Button size="sm" variant="link" className="text-muted p-0" onClick={() => setShowAddResource(false)}>Cancel</Button>
            </div>
          )}
        </div>
      </div>

      <Row className="g-3">
        <Col md={5}>
          <Card className="h-100 bg-dark text-light border-secondary">
            <Card.Body>
              <Card.Title>Timer</Card.Title>
              <TimerPanel
                focusMinutes={sprint.focusMinutes}
                onComplete={handleTimerComplete}
                onTick={handleTimerTick}
              />
              {!showReflection && (
                <div className="mt-4">
                  <Button
                    variant="danger"
                    className="w-100 fw-bold py-2"
                    onClick={() => setShowReflection(true)}
                    style={{ letterSpacing: '0.5px' }}
                  >
                    End Sprint & Reflect
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={7}>
          <Card className="h-100 bg-dark text-light border-secondary">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title className="mb-0">Tasks</Card.Title>
                <div className="text-muted small">
                  {completedTasks}/{totalTasks} Completed
                </div>
              </div>
              
              {/* Task Progress Bar */}
              {totalTasks > 0 && (
                <ProgressBar 
                  now={progressPercent} 
                  variant="info" 
                  className="mb-4" 
                  style={{ height: '6px', backgroundColor: '#334155' }} 
                />
              )}
              
              <TaskList 
                tasks={sprint.tasks} 
                onEditSteps={handleEditSteps}
                onMove={handleMoveTask}
                onRemove={handleRemoveTask}
                onEdit={handleEditTask}
                onComplete={handleCompleteTask}
              />
              
              <div className="mt-3">
                <Button 
                  variant="outline-secondary" 
                  size="sm" 
                  className="w-100 border-dashed" 
                  onClick={handleAddTask}
                >
                  + Add Task
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {showReflection && (
        <Row className="mt-3">
          <Col>
            <Card className="bg-dark text-light border-secondary">
              <Card.Body>
                <ReflectionPrompt 
                  reflection={reflection} 
                  setReflection={setReflection} 
                />
                <div className="d-flex justify-content-end mt-3">
                  <Button 
                    variant="success" 
                    onClick={handleCompleteSprint}
                    className="fw-bold"
                  >
                    Complete Sprint
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Modal for editing task steps on the fly */}
      <TaskStepsModal 
        show={showStepsModal}
        onHide={() => setShowStepsModal(false)}
        task={selectedTaskIndex !== null ? (
          typeof sprint.tasks[selectedTaskIndex] === 'string' 
            ? { text: sprint.tasks[selectedTaskIndex], steps: [] } 
            : sprint.tasks[selectedTaskIndex]
        ) : null}
        onSave={handleSaveSteps}
      />
    </PageContainer>
  );
}

export default SprintDetailPage;
