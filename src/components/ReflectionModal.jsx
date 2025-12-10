import { Modal, Button, Badge, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useState } from "react";

function ReflectionModal({ show, onHide, sprint, onUpdate }) {
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [tempTaskName, setTempTaskName] = useState("");

  // New State for "Add" features
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");

  const [isAddingResource, setIsAddingResource] = useState(false);
  const [newResName, setNewResName] = useState("");
  const [newResUrl, setNewResUrl] = useState("");

  if (!sprint) return null;

  // Helper for Tooltips (same pattern as TaskList.jsx)
  const renderTooltip = (text) => (props) => (
    <Tooltip id={`tooltip-${text.replace(/\s+/g, '-').toLowerCase()}`} {...props}>
      {text}
    </Tooltip>
  );

  // Format date
  const dateStr = new Date(sprint.createdAt).toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Calculate Duration
  const getDuration = () => {
    if (sprint.completedAt && sprint.createdAt) {
      const start = new Date(sprint.createdAt);
      const end = new Date(sprint.completedAt);
      const diffMs = end - start;
      const diffMins = Math.floor(diffMs / 60000);
      return `${diffMins}m Duration`;
    }
    return `${sprint.focusMinutes}m Planned`;
  };

  // Helper for URL formatting
  const formatUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `https://${url}`;
  };

  // Parse Reflection Data
  let reflectionData = null;
  try {
    if (sprint.reflection && sprint.reflection.startsWith("{")) {
      reflectionData = JSON.parse(sprint.reflection);
    }
  } catch (e) {
    // Fallback to legacy string
  }

  const resources = sprint.resources || [];
  // Backward compatibility for legacy single link
  if (resources.length === 0 && sprint.resourceLink && sprint.resourceLink.trim() !== "") {
    resources.push({
      id: "legacy",
      name: "Assignment Resource",
      url: sprint.resourceLink
    });
  }

  const hasResources = resources.length > 0;

  // -- Handlers --

  const handleRemoveResource = (resourceId) => {
    if (!onUpdate) return;
    
    // Check if legacy
    if (resourceId === 'legacy') {
      onUpdate(sprint.id, { resourceLink: "" });
    } else {
      const updatedResources = resources.filter(r => r.id !== resourceId);
      onUpdate(sprint.id, { resources: updatedResources });
    }
  };

  const handleRemoveTask = (indexToRemove) => {
    console.log('handleRemoveTask called', { indexToRemove, onUpdate: !!onUpdate, sprint: !!sprint });
    if (!onUpdate || !sprint) {
      console.error('Missing onUpdate or sprint!');
      return;
    }
    
    // Create a copy of the tasks array
    const currentTasks = sprint.tasks || [];
    const updatedTasks = currentTasks.filter((_, i) => i !== indexToRemove);

    console.log('Calling onUpdate to remove task', { sprintId: sprint.id, updatedTasks });
    // IMMEDIATE UPDATE
    onUpdate(sprint.id, { ...sprint, tasks: updatedTasks });
  };

  const handleMoveTask = (index, direction) => {
    console.log('handleMoveTask called', { index, direction, onUpdate: !!onUpdate, sprintId: sprint?.id });
    if (!onUpdate) {
      console.error('onUpdate is not defined!');
      return;
    }
    const newTasks = [...sprint.tasks];
    
    if (direction === -1 && index > 0) {
      // Swap Up
      const temp = newTasks[index];
      newTasks[index] = newTasks[index - 1];
      newTasks[index - 1] = temp;
    } else if (direction === 1 && index < newTasks.length - 1) {
      // Swap Down
      const temp = newTasks[index];
      newTasks[index] = newTasks[index + 1];
      newTasks[index + 1] = temp;
    } else {
      console.log('Invalid move');
      return; // Invalid move
    }

    console.log('Calling onUpdate with new tasks', newTasks);
    onUpdate(sprint.id, { tasks: newTasks });
  };

  // Feature A: Add Resource Logic
  const handleAddResource = () => {
    if (!newResName.trim() || !newResUrl.trim()) return;
    if (!onUpdate) return;

    const updatedResources = [...resources, {
      id: Date.now().toString(),
      name: newResName.trim(),
      url: newResUrl.trim()
    }];
    onUpdate(sprint.id, { resources: updatedResources });
    setNewResName("");
    setNewResUrl("");
    setIsAddingResource(false);
  };

  const startEditingTask = (index, currentName) => {
    setEditingTaskIndex(index);
    setTempTaskName(currentName);
  };

  const cancelEditingTask = () => {
    setEditingTaskIndex(null);
    setTempTaskName("");
  };

  const saveTaskName = (index) => {
    if (!onUpdate) return;
    const newTasks = [...sprint.tasks];
    const task = newTasks[index];

    // Ensure structure
    if (typeof task === 'string') {
      newTasks[index] = tempTaskName;
    } else {
      newTasks[index] = { ...task, text: tempTaskName };
    }

    onUpdate(sprint.id, { tasks: newTasks });
    setEditingTaskIndex(null);
  };

  // Feature B: Add Task Logic
  const handleSaveNewTask = () => {
    console.log('handleSaveNewTask called', { newTaskName, onUpdate: !!onUpdate });
    if (!newTaskName.trim() || !onUpdate) {
      console.error('Missing task name or onUpdate!');
      return;
    }

    const newTask = { 
        text: newTaskName.trim(), 
        completed: true, 
        completionTime: "Post-Sprint", 
        steps: [] 
    };

    const currentTasks = sprint.tasks || [];
    const updatedTasks = [...currentTasks, newTask];

    console.log('Calling onUpdate to add task', { sprintId: sprint.id, updatedTasks });
    // IMMEDIATE UPDATE
    onUpdate(sprint.id, { ...sprint, tasks: updatedTasks });

    // Reset Form
    setNewTaskName("");
    setIsAddingTask(false);
  };

  const handleTaskKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      saveTaskName(index);
    } else if (e.key === 'Escape') {
      cancelEditingTask();
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg" contentClassName="bg-dark text-light border-secondary">
      <Modal.Header closeButton closeVariant="white" className="border-secondary bg-dark">
        <div className="d-flex flex-column">
          <Modal.Title className="fw-bold">{sprint.title}</Modal.Title>
          <div className="d-flex align-items-center gap-2 mt-1">
            <span className="text-muted small">{dateStr}</span>
            <Badge bg="secondary" className="text-light fw-normal" style={{ fontSize: '0.7rem' }}>
              {getDuration()}
            </Badge>
          </div>
        </div>
      </Modal.Header>
      <Modal.Body className="bg-dark">
        
        {/* SECTION 1: RESOURCES */}
        <div className="mb-4">
           {hasResources && (
             <div className="d-flex flex-wrap gap-2 mb-2">
                {resources.map((res, idx) => (
                  <div key={res.id || idx} className="d-flex align-items-center">
                    <OverlayTrigger
                      placement="top"
                      overlay={renderTooltip("Open Resource")}
                    >
                      <Button
                        href={formatUrl(res.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outline-info"
                        size="sm"
                        className="rounded-pill px-3 d-flex align-items-center gap-2 me-2"
                        style={{ 
                          borderColor: '#38bdf8'
                        }}
                      >
                        <span>🔗</span> {res.name}
                      </Button>
                    </OverlayTrigger>
                    {onUpdate && (
                      <OverlayTrigger
                        placement="top"
                        overlay={renderTooltip("Remove Resource")}
                      >
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="d-flex align-items-center justify-content-center p-0"
                          style={{ width: '32px', height: '32px', borderRadius: '4px' }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRemoveResource(res.id || 'legacy');
                          }}
                        >
                          ×
                        </Button>
                      </OverlayTrigger>
                    )}
                  </div>
                ))}
             </div>
           )}

           {/* Add Resource UI */}
           {onUpdate && (
             !isAddingResource ? (
               <OverlayTrigger
                 placement="top"
                 overlay={renderTooltip("Add a new resource to this record")}
               >
                 <Button 
                   variant="outline-info" 
                   size="sm" 
                   onClick={() => setIsAddingResource(true)}
                   className="mt-1"
                 >
                   + Add Link
                 </Button>
               </OverlayTrigger>
             ) : (
               <div className="d-flex gap-2 align-items-center bg-black bg-opacity-25 border border-secondary p-2 rounded mt-2">
                 <OverlayTrigger
                   placement="top"
                   overlay={renderTooltip("Enter a display name (e.g. 'Math PDF')")}
                 >
                   <Form.Control 
                     size="sm" 
                     placeholder="Name" 
                     value={newResName}
                     onChange={(e) => setNewResName(e.target.value)}
                     className="bg-dark text-white border-secondary placeholder-light"
                     style={{ width: '150px' }}
                     autoFocus
                   />
                 </OverlayTrigger>
                 <OverlayTrigger
                   placement="top"
                   overlay={renderTooltip("Paste the link here")}
                 >
                   <Form.Control 
                     size="sm" 
                     placeholder="URL" 
                     value={newResUrl}
                     onChange={(e) => setNewResUrl(e.target.value)}
                     className="bg-dark text-white border-secondary placeholder-light"
                     style={{ flex: 1 }}
                   />
                 </OverlayTrigger>
                 <OverlayTrigger
                   placement="top"
                   overlay={renderTooltip("Save resource")}
                 >
                   <Button 
                     size="sm" 
                     variant="outline-success" 
                     className="d-flex align-items-center justify-content-center p-0"
                     style={{ width: '32px', height: '32px' }}
                     onClick={(e) => {
                       e.preventDefault();
                       e.stopPropagation();
                       handleAddResource();
                     }}
                   >
                     ✓
                   </Button>
                 </OverlayTrigger>
                 <OverlayTrigger
                   placement="top"
                   overlay={renderTooltip("Cancel addition")}
                 >
                   <Button 
                    size="sm" 
                    variant="outline-danger" // VISUAL FIX: Red Square
                    className="d-flex align-items-center justify-content-center p-0"
                    style={{ width: '32px', height: '32px' }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsAddingResource(false);
                    }}
                   >
                    ×
                   </Button>
                 </OverlayTrigger>
               </div>
             )
           )}
           <hr className="border-secondary my-4" />
        </div>

        {/* SECTION 2: THE PROCESS */}
        <div className="mb-4">
          <h5 className="h6 text-info text-uppercase fw-bold mb-3" style={{ letterSpacing: '1px' }}>The Process</h5>
          <div className="d-flex flex-column gap-3">
            {sprint.tasks.length === 0 ? (
              <p className="text-muted fst-italic">No tasks recorded.</p>
            ) : (
              sprint.tasks.map((task, idx) => {
                const taskText = typeof task === 'string' ? task : task.text;
                const steps = typeof task === 'object' && task.steps ? task.steps : [];
                const isCompleted = typeof task === 'object' && task.completed;
                const completionTime = typeof task === 'object' ? task.completionTime : null;
                const isEditing = editingTaskIndex === idx;
                
                return (
                  <div key={idx} className="d-flex align-items-start justify-content-between p-3 rounded border border-secondary bg-dark">
                    {/* Left Side: Task Content */}
                    <div className="flex-grow-1 me-3">
                      {isEditing ? (
                        <div className="d-flex align-items-center gap-2 w-100">
                          <OverlayTrigger
                            placement="top"
                            overlay={renderTooltip("Enter task name")}
                          >
                            <input 
                              type="text" 
                              autoFocus
                              className="bg-dark text-white border-info rounded px-2 w-100"
                              value={tempTaskName}
                              onChange={(e) => setTempTaskName(e.target.value)}
                              onKeyDown={(e) => handleTaskKeyDown(e, idx)}
                            />
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="top"
                            overlay={renderTooltip("Save item")}
                          >
                            <Button 
                              variant="outline-success" 
                              size="sm" 
                              className="d-flex align-items-center justify-content-center p-0 flex-shrink-0"
                              style={{ width: '32px', height: '32px' }}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                saveTaskName(idx);
                              }}
                            >
                              ✓
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="top"
                            overlay={renderTooltip("Cancel editing")}
                          >
                            <Button 
                              variant="outline-danger" // VISUAL FIX: Red Square
                              size="sm" 
                              className="d-flex align-items-center justify-content-center p-0 flex-shrink-0"
                              style={{ width: '32px', height: '32px' }}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                cancelEditingTask();
                              }}
                            >
                              ×
                            </Button>
                          </OverlayTrigger>
                        </div>
                      ) : (
                        <div className="d-flex flex-column">
                          <div className="d-flex align-items-center gap-2">
                            <span className={`fw-bold ${isCompleted ? "text-light" : "text-white"}`}>
                              {idx + 1}. {taskText}
                            </span>
                            {onUpdate && (
                              <OverlayTrigger
                                placement="top"
                                overlay={renderTooltip("Rename Task")}
                              >
                                <button 
                                  className="btn btn-link p-0 text-light hover-text-info small" 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    startEditingTask(idx, taskText);
                                  }}
                                  style={{ lineHeight: 1, textDecoration: 'none' }}
                                >
                                  ✎
                                </button>
                              </OverlayTrigger>
                            )}
                          </div>
                          
                          {isCompleted && completionTime && completionTime !== 'N/A' && (
                             <small className="text-info mt-1">
                               <i className="bi bi-stopwatch me-1"></i>
                               Took {completionTime}
                             </small>
                          )}

                          {/* Sub-steps Display */}
                          {steps.length > 0 && (
                            <ol type="a" className="ps-4 mt-2 mb-0 text-light small">
                               {steps.map((step, sIdx) => (
                                 <li key={sIdx}>
                                   {step}
                                 </li>
                               ))}
                            </ol>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Right Side: Control Buttons */}
                    <div className="d-flex align-items-center gap-1 flex-shrink-0">
                      {onUpdate && !isEditing && (
                        <>
                          <OverlayTrigger
                            placement="top"
                            overlay={renderTooltip("Move Up")}
                            trigger={['hover', 'focus']}
                          >
                            <Button 
                              variant="outline-secondary" 
                              size="sm" 
                              className="d-flex align-items-center justify-content-center p-0"
                              style={{ width: '28px', height: '28px', pointerEvents: 'auto' }}
                              onClick={(e) => {
                                console.log('Move Up clicked', idx);
                                e.preventDefault();
                                e.stopPropagation();
                                handleMoveTask(idx, -1);
                              }}
                              disabled={idx === 0}
                            >
                              ↑
                            </Button>
                          </OverlayTrigger>

                          <OverlayTrigger
                            placement="top"
                            overlay={renderTooltip("Move Down")}
                            trigger={['hover', 'focus']}
                          >
                            <Button 
                              variant="outline-secondary" 
                              size="sm" 
                              className="d-flex align-items-center justify-content-center p-0"
                              style={{ width: '28px', height: '28px', pointerEvents: 'auto' }}
                              onClick={(e) => {
                                console.log('Move Down clicked', idx);
                                e.preventDefault();
                                e.stopPropagation();
                                handleMoveTask(idx, 1);
                              }}
                              disabled={idx === sprint.tasks.length - 1}
                            >
                              ↓
                            </Button>
                          </OverlayTrigger>

                          <OverlayTrigger
                            placement="top"
                            overlay={renderTooltip("Delete task")}
                            trigger={['hover', 'focus']}
                          >
                            <Button 
                              variant="outline-danger" 
                              size="sm" 
                              className="d-flex align-items-center justify-content-center p-0 ms-1"
                              style={{ width: '28px', height: '28px', pointerEvents: 'auto' }}
                              onClick={(e) => {
                                console.log('Delete clicked', idx);
                                e.preventDefault();
                                e.stopPropagation();
                                handleRemoveTask(idx);
                              }}
                            >
                              ×
                            </Button>
                          </OverlayTrigger>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {/* Add Task UI */}
            {onUpdate && (
              !isAddingTask ? (
                <OverlayTrigger
                  placement="top"
                  overlay={renderTooltip("Add a forgotten task")}
                  trigger={['hover', 'focus']}
                >
                  <Button 
                    variant="outline-info" 
                    size="sm" 
                    className="w-100 border-dashed text-white mt-2" 
                    style={{ pointerEvents: 'auto' }}
                    onClick={(e) => {
                      console.log('Add task clicked');
                      e.preventDefault();
                      e.stopPropagation();
                      setIsAddingTask(true);
                    }}
                  >
                    + Add forgotten task
                  </Button>
                </OverlayTrigger>
              ) : (
                <div className="d-flex gap-2 align-items-center bg-black bg-opacity-25 border border-secondary p-2 rounded mt-2">
                  <span className="text-muted small ms-2">{sprint.tasks.length + 1}.</span>
                  <OverlayTrigger
                    placement="top"
                    overlay={renderTooltip("Enter task name")}
                  >
                    <Form.Control 
                      size="sm" 
                      placeholder="Task Name" 
                      value={newTaskName}
                      onChange={(e) => setNewTaskName(e.target.value)}
                      className="bg-dark text-white border-secondary placeholder-light"
                      autoFocus
                      onKeyDown={(e) => {
                        if(e.key === 'Enter') {
                          e.preventDefault();
                          handleSaveNewTask();
                        }
                        if(e.key === 'Escape') {
                          setIsAddingTask(false);
                        }
                      }}
                    />
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement="top"
                    overlay={renderTooltip("Save item")}
                  >
                    <Button 
                      size="sm" 
                      variant="outline-success" 
                      className="d-flex align-items-center justify-content-center p-0"
                      style={{ width: '32px', height: '32px' }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSaveNewTask();
                      }}
                    >
                      ✓
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement="top"
                    overlay={renderTooltip("Cancel addition")}
                  >
                    <Button 
                      size="sm" 
                      variant="outline-danger" // VISUAL FIX: Red Square
                      className="d-flex align-items-center justify-content-center p-0"
                      style={{ width: '32px', height: '32px' }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsAddingTask(false);
                      }}
                    >
                      ×
                    </Button>
                  </OverlayTrigger>
                </div>
              )
            )}
          </div>
        </div>

        <hr className="border-secondary my-4" />

        {/* SECTION 3: THE INSIGHTS */}
        <div>
          <h5 className="h6 text-info text-uppercase fw-bold mb-3" style={{ letterSpacing: '1px' }}>The Insights</h5>
          <div className="bg-black bg-opacity-25 p-4 rounded border border-secondary">
             {reflectionData ? (
               <div className="d-flex flex-column gap-4">
                 {/* Constraint */}
                 <div>
                   <label className="text-white small text-uppercase fw-bold mb-1">What slowed you down?</label>
                   <p className="mb-0 text-white fs-6">{reflectionData.constraint || "No major roadblocks."}</p>
                 </div>
                 
                 {/* Assessment */}
                 <div>
                   <label className="text-white small text-uppercase fw-bold mb-1">Time Estimation?</label>
                   <p className="mb-0 text-white fs-6">
                     Did I underestimate? <span className={reflectionData.assessment === "Yes" ? "text-warning fw-bold" : "text-success fw-bold"}>{reflectionData.assessment}</span>
                   </p>
                 </div>

                 {/* Insight */}
                 <div>
                   <label className="text-white small text-uppercase fw-bold mb-1">Change for next time?</label>
                   <p className="mb-0 text-white fs-6">{reflectionData.insight || "No specific changes noted."}</p>
                 </div>

                 {/* Motivation (Feature C: Verified Logic) */}
                 <div>
                   <label className="text-white small text-uppercase fw-bold mb-1">Motivation</label>
                   <p className="mb-0 text-white fs-6 fst-italic">
                     "{reflectionData.motivation && reflectionData.motivation.trim() ? reflectionData.motivation : "No motivation specified."}"
                   </p>
                 </div>
               </div>
             ) : (
               // Legacy Support
               <p className="mb-0 text-white" style={{ whiteSpace: "pre-wrap" }}>
                 {sprint.reflection || "No reflection added."}
               </p>
             )}
          </div>
        </div>

      </Modal.Body>
      <Modal.Footer className="border-secondary bg-dark justify-content-center">
        <OverlayTrigger
          placement="top"
          overlay={renderTooltip("Close Flashcard")}
        >
          <Button variant="secondary" onClick={onHide} className="px-5">
            Close Flashcard
          </Button>
        </OverlayTrigger>
      </Modal.Footer>
    </Modal>
  );
}

export default ReflectionModal;
