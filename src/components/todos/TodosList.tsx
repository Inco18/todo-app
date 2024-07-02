import { useTodos } from "../../context/TodosContext";
import { Loader2 } from "lucide-react";
import { Badge } from "../ui/badge";
import AddTodoDialog from "./AddTodoDialog";

const TodosList = () => {
  const { todos, isLoading } = useTodos();

  return (
    <main className="h-full min-h-0 m-auto flex flex-col gap-2">
      <h1 className="text-3xl text-center">Todo list</h1>
      <div>
        <AddTodoDialog />
      </div>
      <div className="max-h-full overflow-y-auto space-y-3 max-w-[60rem]">
        {isLoading && (
          <div className="h-12">
            <Loader2 className="animate-spin m-auto" size={40} />
          </div>
        )}
        {!isLoading &&
          todos.length > 0 &&
          todos.map((todo) => {
            return (
              <div
                key={todo.id}
                className={`border-[1px] py-2 px-4 rounded-lg flex items-center gap-4`}>
                <Badge
                  variant={todo.status}
                  className="w-24 justify-center flex-shrink-0 mb-auto mt-3">
                  {todo.status}
                </Badge>
                <div
                  className={`${
                    todo.status !== "completed" ? "opacity-100" : "opacity-20"
                  }`}>
                  <p
                    className={`${
                      todo.status !== "completed"
                        ? "font-medium"
                        : "font-normal"
                    } `}>
                    {todo.title}
                  </p>
                  <p className="text-sm opacity-60">
                    {new Date(todo.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm">{todo.desc}</p>
                </div>
                <Badge
                  variant={todo.priority}
                  className="w-32 justify-center ml-auto flex-shrink-0  mb-auto mt-3">
                  Priority: {todo.priority}
                </Badge>
              </div>
            );
          })}
        {!isLoading && todos.length < 1 && (
          <h2 className="text-xl">You don't have any todos</h2>
        )}
      </div>
    </main>
  );
};

export default TodosList;
