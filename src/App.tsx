import { useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import ThemeSwitcher from "./components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { defaultNotes } from "@/config/defaultNotes";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function App() {
  const [notes, setNotes] = useState<Note[]>(defaultNotes || []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const form = {} as { [key in string]: any };
    for (const i of formData.keys()) {
      // console.log(`${i}: ${formData.get(i)}`);
      form[i] = formData.get(i) ?? "";
    }
    console.log(form);
    function noteChecker(note) {
      for (const [key, value] of Object.entries(note)) {
        if (value === "") {
          return false;
        }
      }
      return true;
    }

    if (noteChecker(form)) {
      setNotes((prevNotes) => [
        ...prevNotes,
        { ...form, id: prevNotes.length + 1 },
      ]);
      formRef!.current!.reset();
    } else {
      alert("Please fill in all fields");
    }
  }

  const formRef = useRef<HTMLFormElement>();

  return (
    <div className="container p-8 min-h-full h-screen min-w-full flex flex-col gap-4 items-center">
      <div className="flex gap-4">
        {/* <div className="notes-container flex flex-wrap gap-4 flex-1 justify-center "> */}
        <div className="notes-container flex-1 grid grid-cols-2 gap-4">
          {notes.map((note) => (
            <NoteCard
              note={note}
              notes={notes}
              key={note.id}
              setNotes={setNotes}
            />
          ))}
        </div>
        <div className="notes-entry-container flex-0.5">
          <form
            className="flex flex-col gap-4 p-4 rounded-sm outline-black outline outline-1 dark:outline-orange-300 dark:bg-black dark:hover:outline-blue-500 dark:focus:blue-700"
            onSubmit={handleSubmit}
            ref={formRef}
          >
            <Input
              type="text"
              name="title"
              placeholder="Title"
              // className="px-2 font-bold min-h-10 outline-black outline outline-1 dark:outline-slate-600 dark:bg-black dark:hover:outline-blue-500 dark:focus:blue-700"
              className=" outline-black outline outline-1 dark:outline-slate-600 dark:bg-black dark:hover:outline-blue-500 dark:focus:blue-700"
            />
            <Textarea
              name="body"
              className="p-2 min-h-10 outline-black outline outline-1 dark:outline-slate-600 dark:bg-black dark:hover:outline-blue-500 dark:focus:blue-700"
            />
            <Button
              variant="outline"
              type="submit"
            >
              Add Note
            </Button>
          </form>
        </div>
      </div>
      <div className="footer mt-auto bottom-0 flex flex-col justify-center items-center ">
        <ThemeSwitcher />
      </div>
    </div>
  );
}

type NoteCardProps = {
  note: Note;
  notes: Note[];
  // setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  setNotes: (notes: Note[]) => void;
};

type Note = {
  title: string;
  body: string;
  id: number;
};

function NoteCard({
  note: { title, body, id },
  // notes,
  setNotes,
}: NoteCardProps) {
  const [editMode, setEditMode] = useState<boolean>(false);

  const handleEditNote = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    // const note = formData.get("note") as string;
    const form = {} as { [key in string]: any };
    for (const i of formData.keys()) {
      // console.log(`${i}: ${formData.get(i)}`);
      form[i] = formData.get(i) ?? "";
    }
    function updateNote(prevNotes: Note[]) {
      return prevNotes.map((note) =>
        note.id === id ? { ...note, ...form } : note
      );
    }
    setNotes((prevNotes) => updateNote(prevNotes));
    setEditMode(false);
  };

  function handleDeleteNote() {
    function deleteNote(prevNotes: Note[]) {
      return prevNotes.filter((note) => note.id !== id);
    }

    const confirm = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (!confirm) {
      return;
    }
    setNotes((prevNotes) => deleteNote(prevNotes));
  }

  return (
    <div
      className={`note flex flex-col rounded-md ${
        editMode ? "p-1" : "p-3"
      } max-w-sm min-h-[200px] outline-black outline outline-1 dark:outline-orange-300 dark:hover:outline-blue-500 dark:focus:blue-700`}
      key={id}
    >
      <div className="content mb-2 flex-1 flex flex-col">
        {!editMode && (
          <>
            <h3 className="text-xl font-bold">{title}</h3>
            <p>{body}</p>
          </>
        )}
        {editMode && (
          <form
            onSubmit={handleEditNote}
            id="note-form"
            className="flex flex-col flex-1 h-full gap-2"
          >
            <Input
              type="text"
              name="title"
              className="w-full text-xl font-bold"
              defaultValue={title}
            />
            <Textarea
              name="body"
              // className="w-full flex-1 min-h-[150px] h-full dark:bg-black outline-black outline outline-1"
              className="text-base"
              defaultValue={body}
            />
          </form>
        )}
      </div>
      <div className="flex gap-4 bottom-0 mt-auto">
        <Button
          variant={"secondary"}
          type="button"
          onClick={() => setEditMode((prevValue) => !prevValue)}
          className="w-1/2"
        >
          {editMode ? "Cancel" : "Edit"}
        </Button>
        {!editMode ? (
          <Button
            variant={"destructive"}
            type="button"
            onClick={handleDeleteNote}
            className="w-1/2"
          >
            Delete
          </Button>
        ) : (
          <Button
            variant={"default"}
            type={"submit"}
            form="note-form"
            id="save-button"
            className="w-1/2"
          >
            Save
          </Button>
        )}
      </div>
    </div>
  );
}

export default App;
