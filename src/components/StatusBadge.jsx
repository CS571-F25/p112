import React from 'react';
import { Badge } from 'react-bootstrap';

const StatusBadge = ({ status }) => {
  const isCompleted = status === 'completed';
  
  return (
    <Badge 
      bg={isCompleted ? 'primary' : 'success'} 
      className="ms-2"
      style={{ 
        backgroundColor: isCompleted ? '#38bdf8' : '#22c55e', 
        color: '#000' 
      }}
    >
      {isCompleted ? 'Completed' : 'Active'}
    </Badge>
  );
};

export default StatusBadge;

