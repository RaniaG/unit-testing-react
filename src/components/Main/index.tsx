import { useEffect, useState } from "react";
import * as api from "../../api";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { List } from "../List";
import { Loading } from "../Loading";

export const Main = () => {
  const [newTasks, setNewTasks] = useState<any>([]);
  const [doingTasks, setDoingTasks] = useState<any>([]);
  const [doneTasks, setDoneTasks] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = () => {
    setLoading(true);
    api
      .getAllTasks()
      .then((tasks) => {
        setNewTasks(tasks.filter((e) => e.status === "new"));
        setDoingTasks(tasks.filter((e) => e.status === "doing"));
        setDoneTasks(tasks.filter((e) => e.status === "done"));
      })
      .finally(() => setLoading(false));
  };

  const addNewTask = () => {
    setLoading(true);
    api.createTask().then(getTasks);
  };

  return (
    <Container>
      {loading && <Loading />}
      <Row className="justify-content-center">
        <Col xs={8}>
          <Card>
            <Card.Body>
              <Card.Title className="d-flex flex-row justify-content-between">
                <h3>New Tasks</h3>
                <Button variant="primary" onClick={addNewTask}>
                  Add
                </Button>
              </Card.Title>
              <Card.Text>
                <List list={newTasks} onChange={getTasks} />
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        {/* <Col xs={4}>
          <h3>Doing Tasks</h3>
          <List list={doingTasks} onChange={getTasks} />
        </Col>
        <Col xs={4}>
          <h3>Done Tasks</h3>
          <List list={doneTasks} onChange={getTasks} />
        </Col> */}
      </Row>
    </Container>
  );
};
