import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "../supabaseClient";
import { toast } from "react-toastify";
import { Enums } from "../types/supabase.types";

type todosType = {
  id: number;
  createdAt: string;
  title: string;
  desc: string | null;
  status: Enums<"status">;
  priority: Enums<"priority">;
}[];

type todosContextType = {
  todos: todosType;
  setTodos: React.Dispatch<React.SetStateAction<todosType>>;
  isLoading: boolean;
};

const TodosContext = createContext<todosContextType>({
  todos: [],
  setTodos: () => {},
  isLoading: true,
});

export const useTodos = () => {
  return useContext(TodosContext);
};

const TodosProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [todos, setTodos] = useState<todosType>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      if (!user?.id) {
        toast.error("Fetching todos failed: No user");
        setIsLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("userId", user?.id)
        .order("createdAt", { ascending: false });
      if (error) {
        toast.error("Fetching todos failed: " + error.message);
        setIsLoading(false);
        return;
      } else {
        setTodos(data);
      }
      setIsLoading(false);
    };
    fetchTodos();
  }, []);

  return (
    <TodosContext.Provider value={{ todos, setTodos, isLoading }}>
      {children}
    </TodosContext.Provider>
  );
};

export default TodosProvider;
