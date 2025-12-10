import React from 'react';
import { Card } from 'react-bootstrap';

const EmptyState = ({ message, children }) => {
  return (
    <Card bg="dark" text="light" className="border-secondary text-center py-5">
      <Card.Body>
        <Card.Text className="mb-4 text-muted">
          {message || 'No items found.'}
        </Card.Text>
        {children}
      </Card.Body>
    </Card>
  );
};

export default EmptyState;

