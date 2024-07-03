import { todoType, useTodos } from "../../context/TodosContext";
import { Loader2 } from "lucide-react";
import AddTodoDialog from "./AddTodoDialog";
import { useState } from "react";
import SortTodosPopover from "./SortTodosPopover";
import TodoItem from "./TodoItem";

const TodosList = () => {
  const { todos, isLoading } = useTodos();
  const [sort, setSort] = useState<{ by: keyof todoType; asc: boolean }>({
    by: "createdAt",
    asc: true,
  });

  const sortedTodos = [...todos].sort((a, b) => {
    let todoAVal = a[sort.by];
    let todoBVal = b[sort.by];
    if (!todoAVal || !todoBVal) return 0;
    if (sort.by === "status") {
      if (todoAVal === "new") todoAVal = 1;
      if (todoAVal === "in progress") todoAVal = 2;
      if (todoAVal === "completed") todoAVal = 3;
      if (todoBVal === "new") todoBVal = 1;
      if (todoBVal === "in progress") todoBVal = 2;
      if (todoBVal === "completed") todoBVal = 3;
    }
    if (sort.by === "priority") {
      if (todoAVal === "low") todoAVal = 1;
      if (todoAVal === "medium") todoAVal = 2;
      if (todoAVal === "high") todoAVal = 3;
      if (todoBVal === "low") todoBVal = 1;
      if (todoBVal === "medium") todoBVal = 2;
      if (todoBVal === "high") todoBVal = 3;
    }

    if (todoAVal < todoBVal) {
      if (sort.asc) return -1;
      else return 1;
    } else if (todoAVal > todoBVal) {
      if (sort.asc) return 1;
      else return -1;
    } else {
      if (sort.by === "status" || sort.by === "priority") {
        if (a.createdAt < b.createdAt) {
          return 1;
        } else if (a.createdAt > b.createdAt) {
          return -1;
        } else return 0;
      } else return 0;
    }
  });

  return (
    <main className="h-full min-h-0 m-auto flex flex-col gap-2">
      <h1 className="text-3xl text-center">You have {todos.length} todos</h1>
      <div className="flex gap-2 items-end md:min-w-[40rem]">
        <AddTodoDialog />
        <div>
          <p className="text-sm">Sort by</p>
          <SortTodosPopover sort={sort} setSort={setSort} />
        </div>
      </div>
      <div className="max-h-full overflow-y-auto space-y-3 max-w-[60rem] md:min-w-[40rem]">
        {isLoading && (
          <div className="h-12">
            <Loader2 className="animate-spin m-auto" size={40} />
          </div>
        )}
        {!isLoading &&
          sortedTodos.length > 0 &&
          sortedTodos.map((todo) => <TodoItem todo={todo} key={todo.id} />)}
      </div>
    </main>
  );
};

export default TodosList;
