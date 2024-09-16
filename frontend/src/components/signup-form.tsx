import { signUpSchema, TAuthFormProps, TSignUpSchema } from "../types";
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
import { ConflictError, UnauthorizedError } from "../errors/http-errors";

type Props = {
  setAuthForm: (authForm: TAuthFormProps) => void;
  onSuccess: () => void;
};

const SignUpForm = ({ setAuthForm, onSuccess }: Props) => {
  const { setUser } = useUser();
  const [error, setError] = useState("");
  const form = useForm<TSignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: TSignUpSchema) {
    setError("");
    try {
      const user = await UserApi.signUp(values);
      setUser(user);
      onSuccess();
    } catch (error: any) {
      console.log(error);
      if (
        error instanceof UnauthorizedError ||
        error instanceof ConflictError
      ) {
        setError(error.message);
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your username"
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
                <Input type="password" className="bg-transparent" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" className="bg-transparent" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <p>
          Already have an account?
          <Button variant="link" onClick={() => setAuthForm("signin")}>
            Sign In
          </Button>
        </p>

        {!!error && <p className="text-red-500">{error}</p>}

        <Button
          type="submit"
          className="w-full !mt-8"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Signin up..." : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;
