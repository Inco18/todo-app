import { toast } from "react-toastify";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { useAuth } from "../../context/AuthContext";

const TodosHeader = () => {
  const { user, signOut } = useAuth();

  const onSignOut = async () => {
    if (!signOut) return;
    const { error } = await signOut();
    if (error) {
      toast.error("Could not sign out: " + error.message);
    }
  };

  return (
    <header className="py-1 px-5 flex border-b-[1px] border-border">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center ml-auto gap-3 outline-none hover:bg-secondary transition-colors py-1 px-2 rounded-lg">
          <img
            src={"/default-avatar.jpg"}
            alt=""
            className="w-12 rounded-full"
          />
          <p>{user?.email}</p>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className="cursor-pointer" onClick={onSignOut}>
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default TodosHeader;
