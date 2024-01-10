import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Task } from ".";
import * as api from "../../api";

const mockEditableTask = jest.fn();
jest.mock("./components/EditableTask", () => {
  return {
    EditableTask: (props: any) => {
      return <div>Mock Editable Task</div>;
    },
  };
});

const mockDeleteConfirmation = jest.fn();
jest.mock("./components/DeleteConfirmation", () => {
  return {
    DeleteConfirmation: (props: any) => {
      return (
        <div>
          Mock Delete Confirmation
          <button onClick={() => props.onConfirm()}>Confirm Delete</button>
        </div>
      );
    },
  };
});

describe("Task unit tests", () => {
  it("should show title when rendered initially", () => {
    //Arrange
    //Act
    render(<Task id={0} title={"title"} onChange={() => {}} />);
    //Assert
    screen.getByText("title");
  });
  it("should show 'New Task' when title is undefined", () => {
    //Arrange
    //Act
    render(<Task id={0} title={undefined} onChange={() => {}} />);
    //Assert
    screen.getByText("New Task");
  });
  it("should show editable component when edit button is clicked", async () => {
    //Arrange
    render(<Task id={0} title={undefined} onChange={() => {}} />);
    //Act
    fireEvent.click(screen.getByTestId("edit-button"));
    //Assert
    await waitFor(async () => {
      await screen.findByText("Mock Editable Task");
    });
  });
  it("should show edit and delete buttons when rendered initially", async () => {
    //Arrange
    //Act
    render(<Task id={0} title={undefined} onChange={() => {}} />);
    //Assert
    screen.getByTestId("edit-button");
    screen.getByTestId("delete-button");
  });
  it("should show call deleteTask api when delete is confirmed", async () => {
    //Arrange
    const spy = jest.spyOn(api, "deleteTask");
    render(<Task id={0} title={undefined} onChange={() => {}} />);
    //Act
    fireEvent.click(screen.getByTestId("delete-button"));
    const button = await screen.findByText("Confirm Delete");

    //Assert
    await waitFor(async () => {
      button.click();
      expect(spy).toHaveBeenCalled();
    });
  });
});

//should show title when rendered initially
//should show 'New Task' when title is undefined
//should show editable component when edit button is clicked
//should show edit and delete buttons when rendered initially
//should show call deleteTask api when delete is confirmed
