import { useContext } from "react";
import { NotesContext } from "../context/NotesContext";
import NoteCard from "./NoteCard";

const AllNotes = () => {
  const { allNotes, user } = useContext(NotesContext);

  if (!user) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center w-full">
        <img src="./folder.png" alt="Folder Image" className="w-87 h-87" />

        <p className="text-white font-bold text-lg">Login to add notes.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-auto p-4">
      {allNotes?.length > 0 ? (
        <div className="flex my-4 gap-4">
          {allNotes?.map((note) => (
            <NoteCard key={note?.id} note={note} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 flex-auto">
          <img src="./folder.png" alt="Folder Image" className="w-87 h-87" />
          <h3 className="text-white">No notes found</h3>
          <p className="text-white">
            Add some notes by clicking the New Note Icon.
          </p>
        </div>
      )}
    </div>
  );
};

export default AllNotes;
