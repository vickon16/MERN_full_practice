import { fetchData } from "./";
import { TNoteSchema, TNote } from "../types";

export async function fetchNotes(): Promise<TNote[]> {
  const response = await fetchData("/api/notes", {
    method: "GET",
  });
  return response.json();
}

export async function createNote(note: TNoteSchema): Promise<TNote> {
  const response = await fetchData("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });

  return response.json();
}

export async function updateNote(
  id: string,
  note: TNoteSchema
): Promise<TNote> {
  const response = await fetchData(`/api/notes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });

  return response.json();
}

export async function deleteNote(id: string): Promise<void> {
  await fetchData(`/api/notes/${id}`, {
    method: "DELETE",
  });
}
