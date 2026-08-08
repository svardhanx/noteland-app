import { useContext } from "react";
import NoteCard from "./NoteCard";
import { NotesContext } from "../context/NotesContext";
import { Skeleton } from "@mui/material";

const AllNotes = () => {
  const { allNotes, notesLoading, userLoggedIn } = useContext(NotesContext);

  if (!userLoggedIn) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center w-full">
        <img src="./folder.png" alt="Folder Image" className="w-87 h-87" />

        <p className="text-white font-bold text-lg">Login to add notes.</p>
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      {allNotes?.length > 0 ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5"
          data-component="all-notes"
        >
          {allNotes?.map((note) => (
            <NoteCard key={note?.id} note={note} />
          ))}
        </div>
      ) : notesLoading ? (
        <div className="flex items-center gap-3 flex-wrap">
          {Array.from({ length: 19 }, () => crypto.randomUUID()).map((k) => {
            return (
              <Skeleton
                key={k}
                variant="rounded"
                width={210}
                height={120}
                className="grow"
              />
            );
          })}
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
