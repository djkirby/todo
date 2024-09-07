import { TodoItem } from "~/routes/_index";
import { useEffect, useMemo, useState } from "react";
import Todo from "./todo";

interface TodosProps {
  todos: TodoItem[];
  updatedTodo: TodoItem | null;
}

const groupSort = (a: TodoItem, b: TodoItem) => {
  if (a.dueDate && b.dueDate) return +new Date(a.dueDate) - +new Date(b.dueDate);
  return a.dueDate ? -1 : 1;
};

export default function Todos({ todos: loadedTodos, updatedTodo }: TodosProps) {
  const [todos, setTodos] = useState(loadedTodos);

  useEffect(() => {
    if (!updatedTodo) return;
    setTodos((currentTodos) =>
      currentTodos.reduce(
        (acc, e) => acc.concat(e.id === updatedTodo.id ? updatedTodo : e),
        [] as TodoItem[]
      )
    );
  }, [updatedTodo]);

  const sortedTodos = useMemo(() => {
    const overdue = [];
    const current = [];
    const completed = [];
    for (const e of todos) {
      if (e.isComplete) completed.push(e);
      else if (e.dueDate && new Date(e.dueDate) < new Date()) overdue.push(e);
      else current.push(e);
    }

    return [
      ...overdue.sort(groupSort),
      ...current.sort(groupSort),
      ...completed.sort(groupSort),
    ];
  }, [todos]);

  return (
    <div className="space-y-3 w-5/6 sm:w-2/3 md:w-1/2 lg:w-2/5 xl:w-1/3">
      {sortedTodos.length ? (
        sortedTodos.map((todo) => <Todo key={todo.id} todo={todo} />)
      ) : (
        <div>No todo items</div>
      )}
    </div>
  );
}
