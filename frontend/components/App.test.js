import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import "@testing-library/jest-dom/extend-expect";

import AppFunctional from "./AppFunctional";

// Write your tests here
test("sanity", () => {
  expect(true).toBe(true);
});

let up, down, left, right, reset;
let coordinates, steps, message, email;

const updateStatelessSelectors = (document) => {
  up = document.querySelector("#up");
  down = document.querySelector("#down");
  left = document.querySelector("#left");
  right = document.querySelector("#right");
  reset = document.querySelector("#reset");
};

const updateStatefulSelectors = (document) => {
  coordinates = document.querySelector("#coordinates");
  steps = document.querySelector("#steps");
  message = document.querySelector("#message");
  email = document.querySelector("#email");
};

describe("AppFunctional component", () => {
  // Arrange - Render AppFunctional for each test case
  beforeEach(() => {
    render(<AppFunctional />);
    updateStatelessSelectors(document);
    updateStatefulSelectors(document);
  });

  // Act and Assert
  test("verifies whether email input value changes when user types into it", async () => {
    const input = screen.getByTestId("email");

    await userEvent.type(input, "test input");
    // fireEvent.change(input, { target: { value: "test input" } });

    expect(input).toHaveValue("test input");
    expect(input).toHaveAttribute("value", "test input");
    expect(input.value).toBe("test input");
  });

  test("verifies whether clicking the up button 2 times shows a warning message", () => {
    fireEvent.click(up);
    fireEvent.click(up);
    // expect(message.textContent).toBe("Yukarıya gidemezsiniz");
    expect(message).toHaveTextContent("Yukarıya gidemezsiniz");
  });

  test("verifies up, up and right then message should be empty", () => {
    fireEvent.click(up);
    fireEvent.click(up);
    fireEvent.click(right);
    expect(message).toHaveTextContent("");
    expect(message.textContent).toBeFalsy();
  });

  test("renders buttons and title", () => {
    expect(coordinates).toBeInTheDocument();
    expect(steps).toBeInTheDocument();
    expect(left).toBeInTheDocument();

    expect(up).toBeInTheDocument();
    expect(up).toHaveTextContent("YUKARI"); // sensitive

    expect(up.textContent).toBe("YUKARI"); // sensitive
    expect(up.textContent).toEqual("YUKARI"); // insensitive

    expect(up.textContent.toUpperCase()).toBe("YUKARI");

    expect(right).toBeInTheDocument();
    expect(down).toBeInTheDocument();
    expect(reset).toBeInTheDocument();
    expect(email).toBeInTheDocument();
  });
});
