import { json, type MetaFunction } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { useMemo } from "react";
import Todos from "../../components/todos";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const API_HOST = "https://944ba3c5-94c3-4369-a9e6-a509d65912e2.mock.pstmn.io";

// const getTodos = (apiKey: string) =>
//   fetch(API_HOST + "/get", { headers: { "X-API-KEY": apiKey } });

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getTodos = (_apiKey: string): Promise<Response> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ok: true,
        status: 200,
        json: async () => [
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
        ],
      } as Response);
    }, 1000);
  });

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateTodo = async (_apiKey: string, _todo: TodoItem): Promise<Response> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ok: true,
        status: 200,
        json: async () => ({ status: "success" }),
      } as Response);
    }, 1000);
  });

// const updateTodo = async (apiKey: string, todo: TodoItem) =>
//   fetch(`${API_HOST}/patch/${todo.id}`, {
//     method: "PATCH",
//     headers: {
//       "X-API-KEY": apiKey,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ isComplete: !todo.isComplete }),
//   });

export interface TodoItem {
  id: string;
  description: string;
  isComplete: boolean;
  dueDate: string | null;
}

export const loader = async () => {
  const apiKey = import.meta.env.VITE_TODOS_API_KEY;
  try {
    const response = await getTodos(apiKey);
    if (!response.ok) {
      const { error } = JSON.parse(await response.text());
      throw new Error(`[HTTP ${response.status}] - ${error?.message}`);
    }
    const todos: TodoItem[] = (await response.json()) ?? [];
    return json({ todos, hasError: false });
  } catch (e) {
    console.error("Failed to load todos:", e);
    return json({ todos: [], hasError: true }, { status: 500 });
  }
};

export const action = async ({ request }: { request: Request }) => {
  if (request.method !== "POST") return;
  const formData = await request.formData();
  const { _action, id, isComplete, description, dueDate } = Object.fromEntries(formData);
  if (_action !== "toggle") return;

  const todo = {
    id,
    description,
    isComplete: isComplete === "true",
    dueDate: dueDate || null,
  } as TodoItem;

  const apiKey = import.meta.env.VITE_TODOS_API_KEY;
  const { status } = await (await updateTodo(apiKey, todo)).json();
  if (status === "success")
    return json({ _action, ...todo, isComplete: !todo.isComplete });
  throw new Response("Failed to update todo", { status: 500 });
};

export const meta: MetaFunction = () => {
  return [{ title: "Todo App" }, { name: "description", content: "Todo list manager" }];
};

export default function Index() {
  const { todos, hasError } = useLoaderData<typeof loader>();

  const actionData = useActionData<typeof action>();

  const updatedTodo = useMemo(() => {
    const { _action } = actionData ?? {};
    if (_action === "toggle") {
      const { id, isComplete, description, dueDate } = actionData ?? {};
      return { id, isComplete, description, dueDate } as TodoItem;
    }
    return null;
  }, [actionData]);

  return (
    <div>
      <nav className="bg-sky-950 text-white font-medium p-4 text-lg mb-5">Todo App</nav>
      <div className="flex justify-center">
        {hasError ? (
          <div>Error loading todos</div>
        ) : (
          <Todos todos={todos} updatedTodo={updatedTodo} />
        )}
      </div>
    </div>
  );
}
