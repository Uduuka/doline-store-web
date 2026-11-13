"use client";

import { useActionState } from "react";
import { FormMessage, SubmitButton } from "@/components/form-bits";
import { deleteNote, updateNote } from "@/app/dashboard/actions";

/** A note, edited in place: its title and text, with saving and deleting. */
export function NoteEditor({ id, title, body }: { id: string; title: string; body: string }) {
  const [state, action] = useActionState(updateNote, undefined);
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <form action={action} className="flex min-h-0 flex-1 flex-col gap-3">
        <input type="hidden" name="note_id" value={id} />
        <FormMessage state={state} />
        <label className="sr-only" htmlFor="note-title">
          Title
        </label>
        <input id="note-title" name="title" defaultValue={title} placeholder="Title" className="field text-lg font-extrabold" />
        <label className="sr-only" htmlFor="note-body">
          Note
        </label>
        <textarea
          id="note-body"
          name="body"
          defaultValue={body}
          placeholder="Write your note…"
          className="field min-h-[280px] flex-1 resize-none py-3 leading-relaxed"
        />
        <SubmitButton className="btn btn-primary" pendingText="Saving…">
          Save note
        </SubmitButton>
      </form>
      <form
        action={deleteNote}
        onSubmit={(e) => {
          if (!confirm("Delete this note? It's removed from every device.")) e.preventDefault();
        }}
      >
        <input type="hidden" name="note_id" value={id} />
        <button type="submit" className="btn w-full border border-error bg-surface text-error hover:bg-error-container">
          Delete note
        </button>
      </form>
    </div>
  );
}
