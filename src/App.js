import './App.css';
import {Container, Row, Col, Card} from 'react-bootstrap';
import { CalcFormNoFramework } from './CalcFormNoFramework';

function App() {
  return (
    <div className="App">
      <Container fluid>
        <Row>
          <Col>
            <Card>
              <Card.Header>Calculated Form No Framework</Card.Header>
              <Card.Body>
                <Card.Text>
                  <CalcFormNoFramework />
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>2 of 3</Col>
          <Col>3 of 3</Col>
        </Row>
      </Container>
    </div> 
  );
}

export default App;
