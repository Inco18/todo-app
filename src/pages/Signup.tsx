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
import { supabase } from "../supabaseClient";
import { toast } from "react-toastify";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const signupFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 letters long"),
});

const Signup = () => {
  const { user, signIn } = useAuth();
  if (user) {
    return <Navigate to="/" replace />;
  }
  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof signupFormSchema>) {
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    });
    setIsLoading(false);
    if (error) {
      toast.error("Could not sign up: " + error.message);
    }
  }

  return (
    <main className="h-full flex items-center justify-center">
      <div className="bg-secondary p-6 rounded-md flex flex-col">
        <h1 className="m-auto mb-5 text-3xl font-semibold">Sign up</h1>
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
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Signing up..." : "Sign up"}
              </Button>
              <Link
                to={"/login"}
                className={buttonVariants({ variant: "outline" })}>
                Already have an account? Sign in.
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
};

export default Signup;
