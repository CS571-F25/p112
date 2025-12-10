import React from 'react';
import { Container } from 'react-bootstrap';

const PageContainer = ({ children, title }) => {
  return (
    <main className="page-container">
      <Container className="py-4">
        {title && <h1 className="mb-4">{title}</h1>}
        {children}
      </Container>
    </main>
  );
};

export default PageContainer;

