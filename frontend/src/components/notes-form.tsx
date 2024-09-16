import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/form";
import { Input } from "../components/input";
import * as NotesAPI from "../network/notes-api";
import { noteSchema, TNoteSchema, TNote } from "../types";
import { Textarea } from "./text-area";

type Props = {
  defaultData?: TNote;
  onSuccess: (note: TNote) => void;
};

const NotesForm = ({ onSuccess, defaultData }: Props) => {
  const form = useForm<TNoteSchema>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: defaultData?.title ?? "",
      text: defaultData?.text ?? "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: TNoteSchema) {
    try {
      let note: TNote;
      if (!!defaultData) {
        note = await NotesAPI.updateNote(defaultData._id, values);
      } else {
        note = await NotesAPI.createNote(values);
      }
      onSuccess(note);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text</FormLabel>
              <FormControl>
                <Textarea placeholder="Your text" rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting
            ? !!defaultData
              ? "Updating..."
              : "Submitting..."
            : !!defaultData
            ? "Update"
            : "Submit"}
        </Button>
      </form>
    </Form>
  );
};

export default NotesForm;
