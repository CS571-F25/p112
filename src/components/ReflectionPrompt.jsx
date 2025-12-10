import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";

function ReflectionPrompt({ reflection, setReflection, onChange }) {
  // Try to parse existing reflection if it's a JSON string, otherwise default
  const getInitialState = () => {
    try {
      if (reflection && reflection.startsWith("{")) {
        return JSON.parse(reflection);
      }
    } catch (e) {
      // ignore error, use defaults
    }
    return {};
  };

  const initialState = getInitialState();

  const [constraint, setConstraint] = useState(initialState.constraint || "");
  const [assessment, setAssessment] = useState(initialState.assessment || "No");
  const [insight, setInsight] = useState(initialState.insight || "");
  const [motivation, setMotivation] = useState(initialState.motivation || "");

  useEffect(() => {
    // Combine answers into a structured JSON string for storage
    const reflectionData = {
      constraint,
      assessment,
      insight,
      motivation
    };
    
    const jsonString = JSON.stringify(reflectionData);
    
    // Support both prop patterns
    if (setReflection) {
      setReflection(jsonString);
    }
    if (onChange) {
      onChange(jsonString);
    }
  }, [constraint, assessment, insight, motivation, setReflection, onChange]);

  return (
    <div className="reflection-form">
      <h5 className="mb-3">Sprint Reflection</h5>
      
      <Form.Group className="mb-3" controlId="constraint">
        <Form.Label>What specific roadblock slowed you down?</Form.Label>
        <Form.Control
          type="text"
          placeholder="e.g. Spent 20 mins debugging a typo"
          value={constraint}
          onChange={(e) => setConstraint(e.target.value)}
          className="bg-dark text-light border-secondary"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="assessment">
        <Form.Label>Did you underestimate the time required?</Form.Label>
        <div className="text-light">
          <Form.Check
            inline
            label="Yes"
            name="assessment"
            type="radio"
            id="assessment-yes"
            checked={assessment === "Yes"}
            onChange={() => setAssessment("Yes")}
          />
          <Form.Check
            inline
            label="No"
            name="assessment"
            type="radio"
            id="assessment-no"
            checked={assessment === "No"}
            onChange={() => setAssessment("No")}
          />
        </div>
      </Form.Group>

      <Form.Group className="mb-3" controlId="insight">
        <Form.Label>What one thing will you do differently next time?</Form.Label>
        <Form.Control
          type="text"
          placeholder="e.g. Read the docs before coding"
          value={insight}
          onChange={(e) => setInsight(e.target.value)}
          className="bg-dark text-light border-secondary"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="motivation">
        <Form.Label>How does finishing this make you feel about the next step?</Form.Label>
        <Form.Control
          type="text"
          placeholder="e.g. Confident to tackle the next module"
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
          className="bg-dark text-light border-secondary"
        />
      </Form.Group>
    </div>
  );
}

export default ReflectionPrompt;
