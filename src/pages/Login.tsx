import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Button, buttonVariants } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "react-toastify";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 letters long"),
});

const Login = () => {
  const { user, signIn } = useAuth();
  if (user) {
    return <Navigate to="/" replace />;
  }
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    if (!signIn) return;
    const { data, error } = await signIn(values.email, values.password);
    console.log(data, error);
    if (error) {
      toast.error("Could not sign in: " + error.message);
    }
  }

  return (
    <main className="h-full flex items-center justify-center">
      <div className="bg-secondary p-6 rounded-md flex flex-col">
        <h1 className="m-auto mb-5 text-3xl font-semibold">Sign in</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 min-w-[25rem]">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between">
              <Button type="submit">Sign in</Button>
              <Link
                to={"/signup"}
                className={buttonVariants({ variant: "outline" })}>
                Don't have an account yet? Sign up.
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
};

export default Login;
