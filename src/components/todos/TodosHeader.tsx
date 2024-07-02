import { useAuth } from "../../context/AuthContext";

const TodosHeader = () => {
  const { user } = useAuth();
  return <header></header>;
};

export default TodosHeader;
