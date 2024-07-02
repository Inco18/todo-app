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
import { useState } from "react";
import { Button } from "../ui/button";
import { Loader2, Plus } from "lucide-react";
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

const loginFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  status: z.enum(["new", "in progress", "completed"]),
  priority: z.enum(["low", "medium", "high"]),
  desc: z.string().optional(),
});

const AddTodoDialog = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { setTodos } = useTodos();
  const { user } = useAuth();
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      title: "",
      status: "new",
      priority: "low",
      desc: undefined,
    },
  });
  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    if (!user?.id) {
      toast.error("Could not add todo: No user");
      return;
    }
    setIsLoading(true);
    const { data, error } = await supabase
      .from("todos")
      .insert({
        userId: user.id,
        desc: values.desc || null,
        priority: values.priority,
        status: values.status,
        title: values.title,
      })
      .select();
    setIsLoading(false);
    if (error) {
      toast.error("Could not add todo: " + error.message);
    } else {
      setTodos((prev) => {
        return [...data, ...prev];
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
        <Button>
          <Plus size={20} className="mr-1" />
          Add new todo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new todo</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 min-w-[25rem]">
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
                {isLoading ? "Adding..." : "Add"}
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

export default AddTodoDialog;
