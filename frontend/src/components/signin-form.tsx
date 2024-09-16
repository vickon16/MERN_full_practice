import { signInSchema, TAuthFormProps, TSignInSchema } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "./button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";
import * as UserApi from "../network/users-api";
import { useState } from "react";
import useUser from "../hooks/useUser";
import { UnauthorizedError } from "../errors/http-errors";

type Props = {
  setAuthForm: (authForm: TAuthFormProps) => void;
  onSuccess: () => void;
};

const SignInForm = ({ setAuthForm, onSuccess }: Props) => {
  const { setUser } = useUser();
  const [error, setError] = useState("");
  const form = useForm<TSignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: TSignInSchema) {
    try {
      const user = await UserApi.signIn(values);
      setUser(user);
      onSuccess();
    } catch (error: any) {
      console.log(error);
      if (error instanceof UnauthorizedError) {
        setError(error.message);
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Your email"
                  className="bg-transparent"
                  {...field}
                />
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
                <Input
                  type="password"
                  placeholder="Your password"
                  className="bg-transparent"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <p>
          Don't have an account?
          <Button variant="link" onClick={() => setAuthForm("signup")}>
            Sign up
          </Button>
        </p>

        {!!error && <p className="text-red-500">{error}</p>}

        <Button
          type="submit"
          className="w-full !mt-8"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Signin in..." : "Sign In"}
        </Button>
      </form>
    </Form>
  );
};

export default SignInForm;
