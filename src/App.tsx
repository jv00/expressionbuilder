import React from 'react';
import logo from './logo.svg';
import './App.css';
import Container from '@mui/material/Container';
import { OperationBuilder } from './evaluator/components/operationBuilder';

function App() {
  return (
    <Container maxWidth="sm">
      <OperationBuilder />
    </Container>
  );
}

export default App;
