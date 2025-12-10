import { Card, Badge, Button, Stack, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

function SprintCard({ sprint, actionLabel, actionStyle, onView, onDelete }) {
  const taskCount = sprint.tasks?.length || 0;
  const isCompleted = sprint.status === "completed";

  // Helper to ensure links open correctly
  const formatUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `https://${url}`;
  };

  const resources = sprint.resources || [];
  // Backward compatibility for legacy single link
  if (resources.length === 0 && sprint.resourceLink && sprint.resourceLink.trim() !== "") {
    resources.push({
      id: "legacy",
      name: "Resource attached",
      url: sprint.resourceLink
    });
  }

  const hasMultipleResources = resources.length > 1;
  const singleResource = resources.length === 1 ? resources[0] : null;

  return (
    <Card className="h-100 bg-dark text-light border-secondary">
      <Card.Header className="d-flex justify-content-between align-items-center border-secondary bg-transparent">
        <div className="text-truncate pe-2 fw-semibold" style={{ fontSize: '1.1rem' }}>
          {sprint.title}
        </div>
        {onDelete && (
          <Button 
            variant="link" 
            className="text-danger p-0 text-decoration-none fw-bold" 
            style={{ fontSize: '1.5rem', lineHeight: 0.8, opacity: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              onDelete(sprint.id);
            }}
            title="Delete Sprint"
            aria-label={`Delete sprint ${sprint.title}`}
          >
            ×
          </Button>
        )}
      </Card.Header>
      <Card.Body className="d-flex flex-column">
        {sprint.course && (
          <Card.Subtitle className="mb-3 text-secondary small text-uppercase fw-bold">
            {sprint.course}
          </Card.Subtitle>
        )}
        
        {/* Metadata Row: Focus Time & Resources aligned */}
        <div className="d-flex align-items-center gap-3 mb-3">
          <div className="small text-light d-flex align-items-center gap-1">
            <i className="bi bi-clock text-secondary"></i>
            <span>{sprint.status === 'active' ? 'Focus Goal:' : 'Focus:'} {sprint.focusMinutes}m</span>
          </div>
          
          {resources.length > 0 && (
             <div className="d-flex align-items-center" onClick={(e) => e.stopPropagation()}>
               {hasMultipleResources ? (
                 <Dropdown>
                   <Dropdown.Toggle 
                     as={Button} // Use 'as' to prevent default button styling issues
                     variant="link" 
                     className="p-0 text-info text-decoration-none small d-flex align-items-center gap-1 fw-bold border-0 bg-transparent"
                     id={`dropdown-resources-${sprint.id}`}
                     size="sm"
                     style={{ boxShadow: 'none' }} // Remove focus ring
                   >
                     <i className="bi bi-paperclip"></i> {resources.length} Resources attached
                   </Dropdown.Toggle>

                   <Dropdown.Menu variant="dark">
                     {resources.map((res, idx) => (
                       <Dropdown.Item 
                         key={res.id || idx} 
                         href={formatUrl(res.url)} 
                         target="_blank"
                         rel="noopener noreferrer"
                         className="small"
                       >
                         📄 {res.name}
                       </Dropdown.Item>
                     ))}
                   </Dropdown.Menu>
                 </Dropdown>
               ) : (
                 <a 
                   href={formatUrl(singleResource.url)}
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-info text-decoration-none small hover-underline d-flex align-items-center gap-1 fw-bold"
                   onClick={(e) => e.stopPropagation()}
                   title="Open resource in new tab"
                 >
                   <i className="bi bi-paperclip"></i> 1 document attached
                 </a>
               )}
             </div>
          )}
        </div>

        <div className="mb-4">
          <div className="d-flex justify-content-between text-muted small mb-1">
            <span>Tasks</span>
            <span>{taskCount}</span>
          </div>
          {/* Progress Bar Mockup */}
          <div className="progress" style={{ height: "4px", backgroundColor: "#334155" }}>
            <div 
              className="progress-bar bg-success" 
              style={{ width: isCompleted ? "100%" : "0%" }}
            ></div>
          </div>
        </div>

        <div className="mt-auto d-flex gap-2">
           {isCompleted ? (
             <Button 
               variant="outline-info" 
               className="w-100"
               onClick={() => onView(sprint)}
             >
               View Flashcard
             </Button>
           ) : (
             <Link to={`/sprint/${sprint.id}`} className="w-100 text-decoration-none">
               <Button 
                 className="w-100 fw-bold"
                 style={actionStyle}
               >
                 {actionLabel || "Continue Sprint"}
               </Button>
             </Link>
           )}
           
           {/* Add Delete button for Active sprints too if not completed */}
           {!isCompleted && onDelete && (
             <Button
                variant="outline-danger"
                onClick={(e) => {
                  e.preventDefault();
                  if(window.confirm("Are you sure you want to delete this sprint?")) {
                    onDelete(sprint.id);
                  }
                }}
                aria-label="Delete active sprint"
             >
               Delete
             </Button>
           )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default SprintCard;
