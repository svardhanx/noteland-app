import { Divider } from "@mui/material";
import { useContext } from "react";
import { NotesContext } from "../context/NotesContext";

/* eslint-disable react/prop-types */
export default function NoteCard({ note }) {
  const { setCurrentSelectedNote, setCurrentSelectedNoteID, setNoteView } =
    useContext(NotesContext);

  function renderNoteView() {
    setCurrentSelectedNote(note);
    setCurrentSelectedNoteID(note?.id);
    setNoteView(true);
  }

  return (
    <div
      className="bg-white rounded-md flex flex-col gap-2 w-80 h-32 py-4 cursor-pointer"
      onClick={renderNoteView}
    >
      <p className="text-black pl-2 font-semibold underline text-center">
        {note?.title}
      </p>
      <Divider />
      <p className="text-black px-2 text-ellipsis overflow-hidden hyphens-auto line-clamp-2">
        {note?.content}
      </p>
    </div>
  );
}
