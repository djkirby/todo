// eslint-disable-next-line no-unused-vars
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { expect, test, vi, describe, afterEach } from "vitest";
import Todo from "./todo";
import { useNavigation, useSubmit } from "@remix-run/react";

vi.mock("@remix-run/react", () => ({
  useNavigation: vi.fn(),
  useSubmit: vi.fn(() => vi.fn()),
  // eslint-disable-next-line react/prop-types
  Form: ({ children }) => <form>{children}</form>,
}));

const mockTodo = {
  id: "1",
  description: "Test Todo",
  isComplete: false,
  dueDate: null,
};

describe("Todo", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("description", () => {
    test("incomplete todo description is rendered without strike through", () => {
      useNavigation.mockReturnValue({ state: "idle" });

      render(<Todo todo={mockTodo} />);

      const description = screen.getByText("Test Todo");
      expect(description).toBeInTheDocument();
      expect(description).not.toHaveClass("line-through");
    });

    test("completed todo description has strike through", () => {
      const completeTodo = { ...mockTodo, isComplete: true };
      useNavigation.mockReturnValue({ state: "idle" });

      render(<Todo todo={completeTodo} />);

      const description = screen.getByText("Test Todo");
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass("line-through");
    });
  });

  describe("status color", () => {
    test("renders overdue indication", () => {
      const overdueTodo = {
        ...mockTodo,
        dueDate: "2023-06-26T19:00:00.000Z",
      };
      useNavigation.mockReturnValue({ state: "idle" });

      render(<Todo todo={overdueTodo} />);

      expect(screen.getByRole("listitem")).toHaveClass("bg-red-200");
    });

    test("renders completion indication", () => {
      const completeTodo = { ...mockTodo, isComplete: true };
      useNavigation.mockReturnValue({ state: "idle" });

      render(<Todo todo={completeTodo} />);

      expect(screen.getByRole("listitem")).toHaveClass("bg-green-200");
    });

    test("renders normal status indication", () => {
      useNavigation.mockReturnValue({ state: "idle" });

      render(<Todo todo={mockTodo} />);

      expect(screen.getByRole("listitem")).toHaveClass("bg-gray-100");
    });
  });

  describe("due date", () => {
    test("renders due date", () => {
      const todoWithDueDate = { ...mockTodo, dueDate: "2023-06-26T19:00:00.000Z" };
      useNavigation.mockReturnValue({ state: "idle" });

      render(<Todo todo={todoWithDueDate} />);

      expect(screen.getByText("06/26/2023")).toBeInTheDocument();
    });

    test("renders without a due date", () => {
      useNavigation.mockReturnValue({ state: "idle" });

      render(<Todo todo={mockTodo} />);

      expect(screen.getByText("Test Todo")).toBeInTheDocument();
    });
  });

  describe("checkbox", () => {
    test("completed todo checkbox is checked", () => {
      const completeTodo = { ...mockTodo, isComplete: true };
      useNavigation.mockReturnValue({ state: "idle" });

      render(<Todo todo={completeTodo} />);

      expect(screen.getByRole("checkbox")).toBeChecked();
    });

    test("incomplete todo checkbox is not checked", () => {
      useNavigation.mockReturnValue({ state: "idle" });

      render(<Todo todo={mockTodo} />);

      expect(screen.getByRole("checkbox")).not.toBeChecked();
    });

    test("handles checkbox change", () => {
      const mockSubmit = vi.fn();
      useNavigation.mockReturnValue({ state: "idle" });
      useSubmit.mockReturnValue(mockSubmit);

      render(<Todo todo={mockTodo} />);

      fireEvent.click(screen.getByRole("checkbox"));

      expect(mockSubmit).toHaveBeenCalled();
    });

    test("renders spinner if currently being submitted", () => {
      useNavigation.mockReturnValue({
        state: "submitting",
        formData: {
          get: () => mockTodo.id,
        },
      });

      render(<Todo todo={mockTodo} />);

      expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
      expect(screen.getByTestId("spinner")).toBeInTheDocument();
    });

    test("disabled if a different todo is being submitted", () => {
      useNavigation.mockReturnValue({
        state: "submitting",
        formData: {
          get: () => "-1",
        },
      });

      render(<Todo todo={mockTodo} />);

      expect(screen.getByRole("checkbox")).toBeDisabled();
    });
  });
});
