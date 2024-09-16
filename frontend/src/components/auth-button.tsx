import { useState } from "react";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import SignInForm from "./signin-form";
import SignUpForm from "./signup-form";
import { TAuthFormProps } from "@/types";
import useUser from "../hooks/useUser";
import * as UsersAPI from "../network/users-api";

const AuthButton = () => {
  const { user, setUser } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [authForm, setAuthForm] = useState<TAuthFormProps>("signin");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await UsersAPI.logOut();
      setUser(null);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return !user ? (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">Sign In</Button>
      </DialogTrigger>

      <DialogContent className="gap-6">
        <DialogHeader>
          <DialogTitle>
            {authForm === "signin" ? "Sign In" : "Sign up"}
          </DialogTitle>
        </DialogHeader>
        {authForm === "signin" ? (
          <SignInForm
            setAuthForm={setAuthForm}
            onSuccess={() => setIsOpen(false)}
          />
        ) : (
          <SignUpForm
            setAuthForm={setAuthForm}
            onSuccess={() => setIsOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  ) : (
    <Button variant="destructive" onClick={logout} disabled={isLoggingOut}>
      {isLoggingOut ? "Logging Out..." : "Log Out"}
    </Button>
  );
};

export default AuthButton;
