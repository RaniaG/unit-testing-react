import React from "react";
import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Task } from "./components/Task";
import { Col, Container, Row } from "react-bootstrap";
import { Main } from "./components/Main";

function App() {
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={11}>
          <Main />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
