import type { Metadata } from "next";
import Link from "next/link";
import { Fab, FabForm } from "@/components/fab";
import { Field } from "@/components/form-bits";
import { SidePanel } from "@/components/side-panel";
import { Empty } from "@/components/ui";
import { requireStore } from "@/lib/store";
import { shortDate, time } from "@/lib/format";
import { addNote } from "@/app/dashboard/actions";
import { NoteEditor } from "./note-form";

export const metadata: Metadata = { title: "Notes" };
export const dynamic = "force-dynamic";

/**
 * The store's notes (the same `notes` the apps keep, synced both ways): a grid of cards, newest
 * change first. Clicking one opens it on the right to read, edit or delete; + writes a new one.
 */
export default async function NotesPage({ searchParams }: { searchParams: Promise<{ note?: string }> }) {
  const { note } = await searchParams;
  const { supabase, store } = await requireStore();
  const { data } = await supabase
    .from("notes")
    .select("id, title, body, created_at, updated_at")
    .eq("store_id", store.id)
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });
  const notes = data ?? [];
  const open = note ? notes.find((n) => n.id === note) : undefined;

  return (
    <>
      <main className="flex w-full max-w-[1360px] flex-col gap-4 p-4 pb-24 sm:p-6 sm:pb-24">
        <h1 className="sr-only">Notes</h1>
        {notes.length ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {notes.map((n) => (
              <Link
                key={n.id}
                href={`/dashboard/notes?note=${n.id}`}
                scroll={false}
                prefetch={false}
                aria-current={note === n.id ? "true" : undefined}
                className={`card flex min-h-[160px] min-w-0 flex-col gap-2 text-ink no-underline transition-shadow hover:shadow-fab ${note === n.id ? "ring-2 ring-primary" : ""}`}
              >
                {n.title && <span className="line-clamp-2 text-base font-extrabold">{n.title}</span>}
                {n.body && <span className="line-clamp-6 text-[15px] leading-relaxed whitespace-pre-line text-ink-2">{n.body}</span>}
                <span className="mt-auto pt-2 text-xs text-ink-2">
                  {n.updated_at !== n.created_at ? "Edited" : "Written"} {shortDate(n.updated_at)} · {time(n.updated_at)}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <section className="card p-0">
            <Empty>No notes yet. Write one with the + button.</Empty>
          </section>
        )}
      </main>

      {note && (
        <SidePanel closeHref="/dashboard/notes" title={open ? open.title || "Note" : "Note not found"}>
          {open ? (
            <>
              <span className="text-[13px] text-ink-2">
                Written {shortDate(open.created_at)} · {time(open.created_at)}
                {open.updated_at !== open.created_at && ` · edited ${shortDate(open.updated_at)} ${time(open.updated_at)}`}
              </span>
              <NoteEditor key={open.updated_at} id={open.id} title={open.title ?? ""} body={open.body ?? ""} />
            </>
          ) : (
            <p className="m-0 text-ink-2">This note isn&apos;t in {store.name}. It may have been deleted.</p>
          )}
        </SidePanel>
      )}

      <Fab
        label="Write a note"
        options={[
          {
            key: "note",
            label: "Write a note",
            icon: "note",
            title: "New note",
            panel: (
              <FabForm action={addNote} submit="Save note">
                <Field id="title" label="Title" placeholder="Optional" autoFocus />
                <div className="flex flex-col gap-1">
                  <label htmlFor="body" className="label">
                    Note
                  </label>
                  <textarea id="body" name="body" rows={6} placeholder="e.g. Ask Okello about the sugar delivery on Friday" className="field h-auto py-3 leading-relaxed" />
                </div>
              </FabForm>
            ),
          },
        ]}
      />
    </>
  );
}
