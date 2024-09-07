import clsx from "clsx";
import Checkbox from "./checkbox";
import Spinner from "./spinner";
import { TodoItem } from "~/routes/_index";
import { useMemo, useCallback } from "react";
import { Form, useNavigation, useSubmit } from "@remix-run/react";

const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

interface TodoProps {
  todo: TodoItem;
}

export default function Todo({ todo }: TodoProps) {
  const { id, description, isComplete, dueDate } = todo;

  const isOverdue = useMemo(
    () => !isComplete && dueDate && new Date(dueDate) < new Date(),
    [dueDate, isComplete]
  );

  const { state, formData } = useNavigation();
  const submittingId = useMemo(() => {
    if (state === "submitting" && formData) return formData.get("id");
    return null;
  }, [state, formData]);

  const isSubmitting = useMemo(() => submittingId === id, [submittingId, id]);

  const submit = useSubmit();
  const handleCheckboxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      submit(e.currentTarget.form);
    },
    [submit]
  );

  return (
    <div
      role="listitem"
      className={clsx("flex justify-between items-center px-1 py-1", {
        "bg-red-200": isOverdue,
        "bg-green-200": isComplete,
        "bg-gray-100": !isComplete && !isOverdue,
      })}
    >
      <Form method="POST">
        <input type="hidden" name="_action" value="toggle" />
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="description" value={description} />
        <input type="hidden" name="isComplete" value={isComplete ? "true" : "false"} />
        {dueDate && <input type="hidden" name="dueDate" value={dueDate} />}

        <label
          className={clsx("relative flex items-center", {
            "line-through": isComplete,
          })}
        >
          {isSubmitting ? (
            <Spinner />
          ) : (
            <Checkbox
              checked={isComplete}
              disabled={!!submittingId}
              onChange={handleCheckboxChange}
            />
          )}
          {description}
        </label>
      </Form>
      {dueDate && <div className="border border-black px-1">{formatDate(dueDate)}</div>}
    </div>
  );
}
