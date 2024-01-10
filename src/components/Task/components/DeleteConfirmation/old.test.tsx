import { fireEvent, render, screen } from "@testing-library/react";
import { DeleteConfirmation } from ".";

describe.skip("Delete confirmation tests", () => {
  it("should render modal when open is true", () => {
    //Arrange
    //Act
    render(
      <DeleteConfirmation open={true} onConfirm={() => {}} onClose={() => {}} />
    );
    //Assert
    screen.getByText("Delete Confirmation");
  });

  it("should not render modal when open is false", () => {
    //Arrange
    //Act
    render(
      <DeleteConfirmation
        open={false}
        onConfirm={() => {}}
        onClose={() => {}}
      />
    );
    //Assert
    expect(screen.queryByText("Delete Confirmation")).not.toBeInTheDocument();
  });

  it("should call onConfirm when confirm button is clicked", () => {
    //Arrange
    const spy = jest.fn();
    render(
      <DeleteConfirmation open={true} onConfirm={spy} onClose={() => {}} />
    );
    //Act
    const button = screen.getByTestId("confirm-button");
    button.click();
    //Assert
    expect(spy).toHaveBeenCalled();
  });

  it("should call onClose when cancel button is clicked", () => {
    //Arrange
    const spy = jest.fn();
    render(
      <DeleteConfirmation open={true} onConfirm={() => {}} onClose={spy} />
    );
    //Act
    const button = screen.getByRole("button", {
      name: /cancel/i,
    });
    button.click();
    //Assert
    expect(spy).toHaveBeenCalled();
  });

  it("should call onClose when x button is clicked", () => {
    //Arrange
    const spy = jest.fn();
    render(
      <DeleteConfirmation open={true} onConfirm={() => {}} onClose={spy} />
    );
    //Act
    const button = screen.getByRole("button", {
      name: /close/i,
    });
    button.click();
    //Assert
    expect(spy).toHaveBeenCalled();
  });
});

//should render modal when open is true
//should not render modal when open is false
//should call onConfirm when confirm button is clicked
//should call onClose when cancel button is clicked
//should call onClose when x button is clicked
