import { useState } from "react";
import { todoType } from "../../context/TodosContext";
import { Badge } from "../ui/badge";
import EditTodoDialog from "./EditTodoDialog";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

type Props = {
  todo: todoType;
};

const TodoItem = ({ todo }: Props) => {
  const [descLong, setDescLong] = useState(false);

  return (
    <div
      className={`border-[1px] py-2 px-4 rounded-lg flex items-center gap-4`}>
      <Badge
        variant={todo.status}
        className="hidden md:flex w-24 justify-center flex-shrink-0 mb-auto mt-3">
        {todo.status}
      </Badge>
      <Badge variant={todo.status} className="block md:hidden mb-auto mt-3" />
      <div
        className={`${
          todo.status !== "completed" ? "opacity-100" : "opacity-20"
        }`}>
        <p
          className={`${
            todo.status !== "completed" ? "font-medium" : "font-normal"
          } `}>
          {todo.title}
        </p>
        <p className="text-sm opacity-60">
          {new Date(todo.createdAt).toLocaleString()}
        </p>
        <p
          onClick={() => setDescLong((prev) => !prev)}
          className={`text-sm hover:underline cursor-pointer ${
            descLong ? "" : "line-clamp-1"
          }`}>
          {todo.desc}
        </p>
      </div>
      <Badge
        variant={todo.priority}
        className="hidden md:flex w-32 justify-center ml-auto flex-shrink-0  mb-auto mt-3">
        Priority: {todo.priority}
      </Badge>
      <Badge
        variant={todo.priority}
        className="block md:hidden ml-auto mb-auto mt-3"></Badge>
      <div className="flex gap-1 mb-auto mt-[2px]">
        <EditTodoDialog
          todo={{
            id: todo.id,
            title: todo.title,
            desc: todo.desc,
            status: todo.status,
            priority: todo.priority,
          }}
        />
        <ConfirmDeleteDialog todo={{ id: todo.id, title: todo.title }} />
      </div>
    </div>
  );
};

export default TodoItem;
