import './App.css';
import { Form, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import React, { useState } from 'react';

export const TotalField = ({ label, name, value, onChanged = () => { }}) => {
  const [fieldVal, setVal] = useState(value);

  return (<Row className="mb-1">
    <Col md={{ span: 3, offset: 5 }} className="text-end">
      <Form.Label column>{label}:</Form.Label>
    </Col>
    <Col md={{ span: 4 }}>
      <InputGroup>
        <InputGroup.Text>$</InputGroup.Text>
        <FormControl className="text-end" value={fieldVal} name={name} onChange={(e) => {
          setVal(Number(e.target.value));
          onChanged(Number(e.target.value));
        }} />
      </InputGroup>
    </Col>
  </Row>);
};