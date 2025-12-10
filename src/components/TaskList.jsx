import { Button, ButtonGroup, Badge, OverlayTrigger, Tooltip } from "react-bootstrap";

function TaskList({ tasks, onRemove, onMove, onEdit, onEditSteps, onAdd, onComplete }) {
  // Helper to render tooltips
  const renderTooltip = (text) => (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {text}
    </Tooltip>
  );

  return (
    <>
      <ol className="list-group list-group-numbered mb-3">
        {tasks.map((task, index) => {
          // Normalize task structure (handle legacy string tasks)
          const isObject = typeof task === 'object';
          const taskText = isObject ? task.text : task;
          const isCompleted = isObject && task.completed;
          const completionTime = isObject ? task.completionTime : null;

          return (
            <li 
              key={index} 
              className="list-group-item border-secondary d-flex justify-content-between align-items-center py-3"
              style={{ backgroundColor: '#1f2937', color: '#f9fafb' }}
            >
              <div className="ms-2 me-auto d-flex align-items-center flex-wrap">
                {/* Task Text (Always Editable) */}
                {onEdit ? (
                   <div className="d-flex flex-column w-100">
                     <input 
                       type="text"
                       value={taskText}
                       onChange={(e) => onEdit(index, e.target.value)}
                       className="bg-transparent text-light border-0 p-0"
                       style={{ outline: 'none', boxShadow: 'none', minWidth: '200px' }}
                       aria-label={`Edit task ${index + 1}`}
                     />
                     {isCompleted && completionTime && completionTime !== 'N/A' && (
                         <small className="text-info mt-1" style={{ fontSize: '0.75rem' }}>
                           <i className="bi bi-stopwatch me-1"></i>
                           Took {completionTime}
                         </small>
                     )}
                   </div>
                ) : (
                  <div className="d-flex flex-column">
                    <span className={`${isCompleted ? "text-decoration-line-through text-muted" : "fw-medium"} me-2`}>
                      {taskText}
                    </span>
                    {isCompleted && completionTime && completionTime !== 'N/A' && (
                        <small className="text-info mt-1" style={{ fontSize: '0.75rem' }}>
                          <i className="bi bi-stopwatch me-1"></i>
                          Took {completionTime}
                        </small>
                    )}
                  </div>
                )}
                
                {/* Sub-steps count badge */}
                {isObject && task.steps && task.steps.length > 0 && (
                   <Badge bg="dark" className="border border-secondary text-secondary ms-2 fw-normal align-self-start mt-1">
                     {task.steps.length} steps
                   </Badge>
                )}
              </div>

              <div className="d-flex align-items-center gap-2">
                <ButtonGroup size="sm">
                  {/* Complete/Undo Button */}
                  {onComplete && (
                    <OverlayTrigger
                      placement="top"
                      overlay={renderTooltip(isCompleted ? "Undo completion" : "Mark task as done")}
                    >
                      <Button 
                        variant={isCompleted ? "outline-warning" : "outline-success"} 
                        onClick={() => onComplete(index)}
                        aria-label={isCompleted ? "Undo task completion" : "Mark task as complete"}
                        className="d-flex align-items-center justify-content-center"
                      >
                        {isCompleted ? "↺" : "✓"}
                      </Button>
                    </OverlayTrigger>
                  )}

                  {/* Steps Button */}
                  {onEditSteps && (
                    <OverlayTrigger
                      placement="top"
                      overlay={renderTooltip("Break down this task into sub-steps or save notes.")}
                    >
                      <Button 
                        variant="outline-info" 
                        onClick={() => onEditSteps(index)}
                        aria-label="Manage task steps"
                      >
                        📝 Plan Details
                      </Button>
                    </OverlayTrigger>
                  )}

                  {/* Move Up */}
                  {onMove && (
                    <OverlayTrigger
                      placement="top"
                      overlay={renderTooltip("Move task up priority.")}
                    >
                      <Button 
                        variant="outline-light" 
                        onClick={() => onMove(index, -1)}
                        disabled={index === 0}
                        aria-label="Move task up"
                      >
                        ↑
                      </Button>
                    </OverlayTrigger>
                  )}

                  {/* Move Down */}
                  {onMove && (
                    <OverlayTrigger
                      placement="top"
                      overlay={renderTooltip("Move task down priority.")}
                    >
                      <Button 
                        variant="outline-light" 
                        onClick={() => onMove(index, 1)}
                        disabled={index === tasks.length - 1}
                        aria-label="Move task down"
                      >
                        ↓
                      </Button>
                    </OverlayTrigger>
                  )}

                  {/* Delete */}
                  {onRemove && (
                    <OverlayTrigger
                      placement="top"
                      overlay={renderTooltip("Delete Task")}
                    >
                      <Button 
                        variant="outline-danger" 
                        onClick={() => onRemove(index)}
                        aria-label="Delete task"
                        className="border-start-0"
                      >
                        ✕
                      </Button>
                    </OverlayTrigger>
                  )}
                </ButtonGroup>
              </div>
            </li>
          );
        })}
      </ol>
      
      {/* Add Task Button (Only show if onAdd provided) */}
      {onAdd && (
        <Button 
          variant="outline-secondary" 
          size="sm" 
          className="w-100 border-dashed" 
          onClick={onAdd}
        >
          + Add another task
        </Button>
      )}
    </>
  );
}

export default TaskList;
