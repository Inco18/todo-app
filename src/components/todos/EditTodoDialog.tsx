import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Loader2, Pencil } from "lucide-react";
import { z } from "zod";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Badge } from "../ui/badge";
import { useTodos } from "../../context/TodosContext";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { todoFormSchema } from "../../schemas/todoFormSchema";
import { Enums } from "../../types/supabase.types";

type Props = {
  todo: {
    id: number;
    title: string;
    desc: string | null;
    status: Enums<"status">;
    priority: Enums<"priority">;
  };
};

const EditTodoDialog = ({ todo }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { setTodos } = useTodos();
  const { user } = useAuth();
  const defaultValues: z.infer<typeof todoFormSchema> = useMemo(() => {
    return {
      title: todo.title,
      status: todo.status,
      priority: todo.priority,
      desc: todo.desc !== null ? todo.desc : undefined,
    };
  }, [todo]);
  const form = useForm<z.infer<typeof todoFormSchema>>({
    resolver: zodResolver(todoFormSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [todo, defaultValues, form]);

  async function onSubmit(values: z.infer<typeof todoFormSchema>) {
    if (!user?.id) {
      toast.error("Could not edit todo: No user");
      return;
    }
    setIsLoading(true);
    const { data, error } = await supabase
      .from("todos")
      .update({
        desc: values.desc || null,
        priority: values.priority,
        status: values.status,
        title: values.title,
      })
      .eq("id", todo.id)
      .select()
      .single();
    setIsLoading(false);
    if (error) {
      toast.error("Could not edit todo: " + error.message);
    } else {
      setTodos((prev) => {
        return prev.map((prevTodo) => {
          if (prevTodo.id !== data.id) return prevTodo;
          else return data;
        });
      });
      setOpen(false);
    }
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(bool) => {
        form.reset();
        setOpen(bool);
      }}>
      <DialogTrigger asChild>
        <Button variant={"outline"} size={"icon"} className="flex-shrink-0">
          <Pencil size={14} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit todo</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 md:min-w-[25rem]">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-evenly gap-5">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Status*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="new">
                          <Badge
                            variant={"new"}
                            className="w-24 justify-center">
                            new
                          </Badge>
                        </SelectItem>
                        <SelectItem value="in progress">
                          <Badge
                            variant={"in progress"}
                            className="w-24 justify-center">
                            in progress
                          </Badge>
                        </SelectItem>
                        <SelectItem value="completed">
                          <Badge
                            variant={"completed"}
                            className="w-24 justify-center">
                            completed
                          </Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Priority*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">
                          <Badge
                            variant={"low"}
                            className="w-24 justify-center">
                            low
                          </Badge>
                        </SelectItem>
                        <SelectItem value="medium">
                          <Badge
                            variant={"medium"}
                            className="w-24 justify-center">
                            medium
                          </Badge>
                        </SelectItem>
                        <SelectItem value="high">
                          <Badge
                            variant={"high"}
                            className="w-24 justify-center">
                            high
                          </Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Editing..." : "Edit"}
              </Button>
              <DialogClose asChild>
                <Button variant={"outline"}>Cancel</Button>
              </DialogClose>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTodoDialog;
