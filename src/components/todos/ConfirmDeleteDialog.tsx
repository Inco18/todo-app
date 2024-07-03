import { useState } from "react";
import { useTodos } from "../../context/TodosContext";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { supabase } from "../../supabaseClient";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2, X } from "lucide-react";

type Props = {
  todo: {
    id: number;
    title: string;
  };
};

const ConfirmDeleteDialog = ({ todo }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { setTodos } = useTodos();
  const { user } = useAuth();

  async function onConfirm() {
    if (!user?.id) {
      toast.error("Could not delete todo: No user");
      return;
    }
    setIsLoading(true);
    const { data, error } = await supabase
      .from("todos")
      .delete()
      .eq("id", todo.id)
      .select()
      .single();
    setIsLoading(false);
    if (error) {
      toast.error("Could not delete todo: " + error.message);
    } else {
      setTodos((prev) => {
        return prev.filter((prevTodo) => prevTodo.id !== data.id);
      });
      setOpen(false);
    }
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(bool) => {
        setOpen(bool);
      }}>
      <DialogTrigger asChild>
        <Button variant={"outline"} size={"icon"} className="flex-shrink-0">
          <X size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete todo</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete todo: <strong>{todo.title}</strong>?
            This operation is{" "}
            <strong className="text-destructive">permanent</strong>.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant={"destructive"}
            disabled={isLoading}
            onClick={onConfirm}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
          <DialogClose asChild>
            <Button variant={"outline"}>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
