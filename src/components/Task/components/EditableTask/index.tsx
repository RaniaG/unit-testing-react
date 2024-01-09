import {
  Formik,
  FormikHelpers,
  FormikValues,
  Form as FormikForm,
} from "formik";
import { Button, Form } from "react-bootstrap";
import "./index.css";
import * as api from "../../../../api/index";
import { Loading } from "../../../Loading";
import { useState } from "react";

interface Props {
  id: number;
  title: string;
  onCancel: () => void;
  onEdit: () => void;
}

export const EditableTask = ({ id, title, onCancel, onEdit }: Props) => {
  const [loading, setLoading] = useState(false);

  const onSubmit = (values: any) => {
    setLoading(true);
    api
      .editTask(id, values.title)
      .then(() => onEdit())
      .finally(() => setLoading(false));
  };

  return (
    <Formik initialValues={{ title }} onSubmit={onSubmit}>
      {({ values, handleChange, handleBlur }) => (
        <FormikForm>
          <Form.Group className="d-flex flex-row container">
            {loading && <Loading />}
            <Form.Control
              type="text"
              placeholder="Title"
              name="title"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
            ></Form.Control>
            <div className="d-flex flex-row">
              <Button variant="outline-primary" type="submit">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path d="M21.03 5.72a.75.75 0 0 1 0 1.06l-11.5 11.5a.747.747 0 0 1-1.072-.012l-5.5-5.75a.75.75 0 1 1 1.084-1.036l4.97 5.195L19.97 5.72a.75.75 0 0 1 1.06 0Z"></path>
                </svg>
              </Button>
              <Button variant="outline-danger" onClick={() => onCancel()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path d="M5.72 5.72a.75.75 0 0 1 1.06 0L12 10.94l5.22-5.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L13.06 12l5.22 5.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L12 13.06l-5.22 5.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L10.94 12 5.72 6.78a.75.75 0 0 1 0-1.06Z"></path>
                </svg>
              </Button>
            </div>
          </Form.Group>
        </FormikForm>
      )}
    </Formik>
  );
};
