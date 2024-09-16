import { Edit, Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/dialog";
import NotesForm from "../components/notes-form";
import useUser from "../hooks/useUser";
import { formatDate } from "../lib/utils";
import * as NotesAPI from "../network/notes-api";
import * as UsersAPI from "../network/users-api";
import { TNote } from "../types";

function HomePage() {
  const { setUser, user } = useUser();
  const [notes, setNotes] = useState<TNote[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingData, setEditingData] = useState<TNote | undefined>(undefined);
  const [notesLoading, setNotesLoading] = useState(true);
  const [notesError, setNotesError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await UsersAPI.getLoggedInUser();
        !user ? setUser(null) : setUser(user);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, [setUser]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setNotesError("");
        const notes = await NotesAPI.fetchNotes();
        setNotes(notes);
        setNotesLoading(false);
      } catch (error) {
        setNotesLoading(false);
        setNotesError("Error Loading Notes");
        console.log(error);
      }
    };
    fetchNotes();
  }, []);

  const onDeleteNote = async (id: string) => {
    try {
      await NotesAPI.deleteNote(id);
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return !user ? (
    <div className="flex flex-col gap-2 items-center justify-center w-full h-full min-h-[300px]">
      <h2 className="text-xl font-bold">You are not currently logged In</h2>
      <p className="text-muted-foreground">Please Login to see your notes</p>
    </div>
  ) : (
    <>
      <div className="w-full flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-muted-foreground">
          Your Notes
        </h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild onClick={() => setEditingData(undefined)}>
            <Button>Add Note</Button>
          </DialogTrigger>
          <DialogContent className="gap-6">
            <DialogHeader>
              <DialogTitle>
                {!!editingData ? "Update Note" : "Add a New Note"}
              </DialogTitle>
            </DialogHeader>
            <NotesForm
              defaultData={editingData}
              onSuccess={(note) => {
                setNotes((prev) => {
                  const foundIndex = prev.findIndex((n) => n._id === note._id);
                  if (foundIndex !== -1) {
                    return [
                      ...prev.slice(0, foundIndex),
                      note,
                      ...prev.slice(foundIndex + 1),
                    ];
                  } else {
                    return [note, ...prev];
                  }
                });
                setIsOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
      {notesLoading ? (
        <div className="flex justify-center items-center w-full h-full flex-1">
          <Loader2 className="animate-spin size-8" />
        </div>
      ) : !!notesError ? (
        <div className="flex justify-center items-center w-full h-full min-h-[300px]">
          <p className="text-red-500">Error: {notesError}</p>
        </div>
      ) : !notes.length ? (
        <div className="flex justify-center items-center w-full h-full min-h-[300px]">
          <p className="text-muted-foreground font-semibold">
            ...No Notes Found...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full max-w-[1400px] mx-auto">
          {notes.map((note) => (
            <div
              key={note._id}
              className="flex flex-col gap-4 duration-500 cursor-pointer hover:shadow-lg hover:shadow-foreground/50 rounded-md border border-border bg-card p-4"
              onClick={() => navigate(`/notes/${note._id}`)}
            >
              <h3 className="text-xl font-semibold">{note.title}</h3>
              <p className="text-md text-muted-foreground min-h-[100px] whitespace-pre-line [mask-image:_linear-gradient(to_top,_transparent,_background_50%)] line-clamp-4 w-full overflow-hidden">
                {note.text}
              </p>
              <div className="w-full flex justify-between items-center gap-2 border-t pt-2">
                <p className="text-muted-foreground text-sm">
                  {new Date(note.updatedAt).getTime() >
                  new Date(note.createdAt).getTime()
                    ? `Updated: ${formatDate(note.updatedAt)}`
                    : `Created: ${formatDate(note.createdAt)}`}
                </p>
                <div className="flex gap-2 items-center">
                  <button
                    className="text-destructive"
                    onClick={async (e) => {
                      e.stopPropagation();
                      onDeleteNote(note._id);
                    }}
                  >
                    <Trash2 className="size-4" />
                  </button>
                  <button
                    className="text-emerald-500"
                    onClick={async (e) => {
                      e.stopPropagation();
                      setEditingData(note);
                      setIsOpen(true);
                    }}
                  >
                    <Edit className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default HomePage;
