import React, { useState } from 'react';
import { Row, Col, Button, InputGroup, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const SprintHeader = ({ sprint, showBack = true }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(sprint.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderTooltip = (props) => (
    <Tooltip id="copy-tooltip" {...props}>
      Copy Sprint ID to clipboard to share with friends.
    </Tooltip>
  );

  return (
    <div className="mb-4">
      <Row className="align-items-center">
        <Col md={7}>
          <h2 className="mb-1">
            {sprint.title}
            <StatusBadge status={sprint.status} />
          </h2>
          <p className="text-muted mb-0">
            {sprint.course && `${sprint.course} • `}
            Focus Window: {sprint.focusMinutes} min
          </p>
        </Col>
        <Col md={5} className="mt-3 mt-md-0 d-flex flex-column flex-md-row justify-content-end align-items-md-center gap-3">
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
              overlay={renderTooltip}
            >
              <Button 
                variant="outline-secondary" 
                onClick={handleCopy}
                title="Copy Code"
              >
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </OverlayTrigger>
          </InputGroup>

          {showBack && (
            <Button 
              as={Link} 
              to="/library" 
              variant="outline-secondary"
              className="text-light"
              size="sm"
            >
              Back to Library
            </Button>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default SprintHeader;
