import { useState } from "react";
import { Form } from "react-bootstrap";

function ReflectionPrompt({ onChange }) {
  const [text, setText] = useState("");

  const handleChange = (event) => {
    const value = event.target.value;
    setText(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <Form.Group controlId="reflectionPrompt" className="mb-0">
      <Form.Label>Quick reflection</Form.Label>
      <Form.Control
        as="textarea"
        rows={3}
        placeholder="What did you learn in this sprint or what would you do differently next time?"
        value={text}
        onChange={handleChange}
      />
    </Form.Group>
  );
}

export default ReflectionPrompt;
