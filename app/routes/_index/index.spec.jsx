// eslint-disable-next-line no-unused-vars
import React from "react";
import { json } from "@remix-run/node";
import { createRemixStub } from "@remix-run/testing";
import { render, screen, waitFor } from "@testing-library/react";
import { test, expect, describe } from "vitest";
import Index from "./index";

describe("Index", () => {
  test("renders loader data", async () => {
    const todos = [
      {
        id: "1",
        description: "File 2023 Taxes",
        isComplete: true,
        dueDate: "2023-03-10T17:50:44.673Z",
      },
      { id: "2", description: "Fold laundry", isComplete: true, dueDate: null },
    ];

    const RemixStub = createRemixStub([
      {
        path: "/",
        Component: Index,
        loader() {
          return json({ todos, hasError: false });
        },
      },
    ]);

    render(<RemixStub />);

    await waitFor(() => {
      expect(screen.getByText("File 2023 Taxes")).toBeInTheDocument();
      expect(screen.getByText("03/10/2023")).toBeInTheDocument();
      expect(screen.getByText("Fold laundry")).toBeInTheDocument();
    });
  });

  test("displays error message when there is an error", async () => {
    const RemixStub = createRemixStub([
      {
        path: "/",
        Component: Index,
        loader() {
          return json({ todos: [], hasError: true });
        },
      },
    ]);

    render(<RemixStub />);

    const errorMessage = await screen.findByText("Error loading todos");
    expect(errorMessage).toBeInTheDocument();
  });
});
