import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { EditableTask } from ".";

const mockEditTask = jest.fn().mockResolvedValue({});
jest.mock("../../../../api", () => {
  return {
    editTask: () => mockEditTask(),
  };
});

describe("Editable task tests", () => {
  it("should render title when passed as props", () => {
    //Arrange
    const title = "title";
    //Act
    render(
      <EditableTask
        id={0}
        title={title}
        onCancel={() => {}}
        onEdit={() => {}}
      />
    );
    //Assert
    expect(screen.getByRole("textbox")).toHaveValue(title);
  });
  it("should call editTask api when success button is clicked", async () => {
    //Arrange
    const title = "title";
    render(
      <EditableTask
        id={0}
        title={title}
        onCancel={() => {}}
        onEdit={() => {}}
      />
    );
    //Act
    fireEvent.click(screen.getByTestId("submit-button"));
    //Assert
    await waitFor(() => {
      expect(mockEditTask).toHaveBeenCalled();
    });
  });
  it("should call onEdit when editTask api is successful", async () => {
    //Arrange
    const spy = jest.fn();
    const title = "title";
    render(
      <EditableTask id={0} title={title} onCancel={() => {}} onEdit={spy} />
    );
    //Act
    await fireEvent.click(screen.getByTestId("submit-button"));
    //Assert
    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
    });
  });
  it("should call onCancel when cancel button is clicked", async () => {
    //Arrange
    const spy = jest.fn();
    const title = "title";
    render(
      <EditableTask id={0} title={title} onCancel={spy} onEdit={() => {}} />
    );
    //Act
    await fireEvent.click(screen.getByTestId("cancel-button"));
    //Assert
    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
    });
  });
});

//should render title when passed as props
//should call editTask api when success button is clicked
//should call onEdit when editTask api is successful
//should call onCancel when cancel button is clicked
