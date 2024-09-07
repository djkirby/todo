// eslint-disable-next-line no-unused-vars
import React from "react";
import { render, screen, within } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { expect, test, describe, beforeEach, vi } from "vitest";
import { useNavigation } from "@remix-run/react";
import Todos from "./todos";

vi.mock("@remix-run/react", () => ({
  useNavigation: vi.fn(),
  useSubmit: vi.fn(() => vi.fn()),
  // eslint-disable-next-line react/prop-types
  Form: ({ children }) => <form>{children}</form>,
}));

const mockTodos = [
  {
    id: "1",
    description: "File 2023 Taxes",
    isComplete: true,
    dueDate: "2023-03-10T17:50:44.673Z",
  },
  {
    id: "2",
    description: "Fold laundry",
    isComplete: true,
    dueDate: null,
  },
  {
    id: "3",
    description: "Call Mom",
    isComplete: false,
    dueDate: "2023-06-26T19:00:00.000Z",
  },
  {
    id: "4",
    description: "Walk the dog",
    isComplete: false,
    dueDate: null,
  },
  {
    id: "5",
    description: "Feed the cat",
    isComplete: false,
    dueDate: "2024-06-24T15:45:00.000Z",
  },
  {
    id: "6",
    description: "Run LA marathon",
    isComplete: false,
    dueDate: "2023-03-21T13:30:00.000Z",
  },
];

describe("Todos Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigation.mockReturnValue({ state: "idle" });
  });

  test("renders correctly with no todos", () => {
    render(
      <BrowserRouter>
        <Todos todos={[]} />
      </BrowserRouter>
    );
    expect(screen.getByText("No todo items")).toBeInTheDocument();
  });

  test("updates the todo to completed when updatedTodo changes", () => {
    const updatedTodo = { ...mockTodos[2], isComplete: true };

    render(
      <BrowserRouter>
        <Todos todos={mockTodos} updatedTodo={updatedTodo} />
      </BrowserRouter>
    );

    const description = screen.getByText("Call Mom");
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass("line-through");
  });

  test("updates the todo to not completed when updatedTodo changes", () => {
    const updatedTodo = { ...mockTodos[0], isComplete: false };

    render(
      <BrowserRouter>
        <Todos todos={mockTodos} updatedTodo={updatedTodo} />
      </BrowserRouter>
    );

    const description = screen.getByText("File 2023 Taxes");
    expect(description).toBeInTheDocument();
    expect(description).not.toHaveClass("line-through");
  });

  test("sorts the todos correctly by groups and within groups by date", () => {
    render(
      <BrowserRouter>
        <Todos todos={mockTodos} />
      </BrowserRouter>
    );

    const todoItems = screen.getAllByRole("listitem");

    expect(within(todoItems[0]).getByText("Run LA marathon")).toBeInTheDocument();
    expect(within(todoItems[1]).getByText("Call Mom")).toBeInTheDocument();
    expect(within(todoItems[2]).getByText("Feed the cat")).toBeInTheDocument();
    expect(within(todoItems[3]).getByText("Walk the dog")).toBeInTheDocument();
    expect(within(todoItems[4]).getByText("File 2023 Taxes")).toBeInTheDocument();
    expect(within(todoItems[5]).getByText("Fold laundry")).toBeInTheDocument();
  });
});
