import TodosHeader from "../components/todos/TodosHeader";
import TodosList from "../components/todos/TodosList";
import TodosProvider from "../context/TodosContext";

const Todos = () => {
  return (
    <>
      <TodosHeader />
      <TodosProvider>
        <TodosList />
      </TodosProvider>
    </>
  );
};

export default Todos;
