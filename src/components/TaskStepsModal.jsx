import React, { useState } from 'react';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';

const TaskStepsModal = ({ show, onHide, task, onSave }) => {
  const [stepText, setStepText] = useState("");
  const [steps, setSteps] = useState(task?.steps || []);

  // Update steps when task changes (modal opens)
  React.useEffect(() => {
    setSteps(task?.steps || []);
  }, [task]);

  const handleAddStep = (e) => {
    e.preventDefault();
    if (!stepText.trim()) return;
    setSteps([...steps, stepText.trim()]);
    setStepText("");
  };

  const handleRemoveStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(steps);
    onHide();
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered 
      contentClassName="bg-dark text-light border-secondary"
      backdropClassName="bg-black opacity-50"
    >
      <Modal.Header closeButton closeVariant="white" className="border-secondary bg-dark">
        <div className="w-100">
          <Modal.Title>Steps for: {task?.text}</Modal.Title>
          <p className="text-white small mb-0 mt-2">
            Record exactly how you tackle this task step-by-step. This saves a personal process guide you can review later as a flashcard to remember your method and practice it in the future.
          </p>
        </div>
      </Modal.Header>
      <Modal.Body className="bg-dark text-light">
        <Form onSubmit={handleAddStep} className="mb-4">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Add a step (e.g., Draft Outline)"
              value={stepText}
              onChange={(e) => setStepText(e.target.value)}
              className="bg-dark text-light border-secondary placeholder-gray-500"
              style={{ color: '#fff', backgroundColor: '#212529' }} 
            />
            <Button 
              type="submit" 
              variant="outline-info"
              disabled={!stepText.trim()}
            >
              Add Step
            </Button>
          </InputGroup>
        </Form>

        <div className="d-flex flex-column gap-2">
          {steps.length === 0 ? (
            <div className="text-center py-4 border border-secondary border-dashed rounded text-muted small fst-italic">
              No sub-steps added yet.
            </div>
          ) : (
            <ol className="list-group list-group-numbered">
              {steps.map((step, index) => (
                <li 
                  key={index} 
                  className="list-group-item bg-dark text-light border-secondary d-flex justify-content-between align-items-center"
                >
                  <div className="ms-2 me-auto text-break">
                    {step}
                  </div>
                  <Button 
                    variant="link" 
                    className="text-danger p-0 ms-2 text-decoration-none" 
                    onClick={() => handleRemoveStep(index)}
                    aria-label={`Remove step ${index + 1}`}
                    style={{ fontSize: '1.2rem', lineHeight: 1 }}
                  >
                    ×
                  </Button>
                </li>
              ))}
            </ol>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="border-secondary bg-dark">
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button 
          variant="info" 
          onClick={handleSave}
          style={{
            backgroundColor: "#38bdf8",
            color: "#000",
            border: "none",
            fontWeight: "600"
          }}
        >
          Save Steps
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TaskStepsModal;
