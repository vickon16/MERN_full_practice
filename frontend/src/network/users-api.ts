import { fetchData } from ".";
import { TSignInSchema, TSignUpSchema, TUser } from "../types";

export async function getLoggedInUser(): Promise<TUser> {
  const response = await fetchData("/api/users/me", {
    method: "GET",
    // we could also use the `credentials` option here
    // but our backend and frontend are on the same proxy
    // so the credentials are sent automatically
  });
  return response.json();
}

export async function signIn(credentials: TSignInSchema): Promise<TUser> {
  const response = await fetchData("/api/users/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

export async function signUp(credentials: TSignUpSchema): Promise<TUser> {
  const response = await fetchData("/api/users/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

export async function logOut(): Promise<void> {
  await fetchData("/api/users/logout", {
    method: "POST",
  });
}
