import { fireEvent, render, screen } from "@testing-library/react";
import { DeleteConfirmation } from "..";

describe("DeleteConfirmation unit tests", () => {
  //should show Title when open props is true
  //should call onClose when Cancel button is clicked
  //should call onConfirm when Yes button is clicked
  it("should show Title when open props is true", () => {
    //Arrange
    const openProps = true;
    //Act
    render(
      <DeleteConfirmation
        open={openProps}
        onConfirm={() => {}}
        onClose={() => {}}
      />
    );
    //Assert
    screen.getByText("Delete Confirmation");
  });

  it("should call onClose when Cancel button is clicked", () => {
    //Arrange
    const openProps = true;
    const onCloseSpy = jest.fn();
    render(
      <DeleteConfirmation
        open={openProps}
        onConfirm={() => {}}
        onClose={onCloseSpy}
      />
    );
    //Act
    fireEvent.click(screen.getByTestId("cancel-button"));
    //Assert
    expect(onCloseSpy).toHaveBeenCalled();
  });
});
