import { useEffect } from "react";
import Header from "./Header";
import LoginComponent from "./Auth/LoginComponent";
import SignUpComponent from "./Auth/SignUpComponent";
import NewNoteIcon from "./NewNoteIcon";
import WarningToastComponent from "../toasts/WarningToastComponent";
import MainSection from "./MainSection";
import { useAuthStore } from "../store/authStore";
import { useNotesStore } from "../store/notesStore";

export default function ApplicationLayout() {
  const userLoggedIn = useAuthStore((s) => s.userLoggedIn);
  const authChecked = useAuthStore((s) => s.authChecked);
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const fetchUser = useAuthStore((s) => s.fetchUser);
  const user = useAuthStore((s) => s.user);

  const newNote = useNotesStore((s) => s.newNote);
  const placeholder = useNotesStore((s) => s.placeholder);
  const noteView = useNotesStore((s) => s.noteView);
  const fetchNotes = useNotesStore((s) => s.fetchNotes);

  // Once on mount: resolve "logged in?" so a hard refresh doesn't flash logged-out.
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Once, the moment auth resolves true: load user + notes. Never re-runs on note CRUD.
  useEffect(() => {
    if (!userLoggedIn) return;
    fetchUser();
    fetchNotes();
  }, [fetchNotes, fetchUser, userLoggedIn]);

  if (!authChecked) return null;

  return (
    <>
      <div className="flex flex-col min-h-dvh relative overflow-hidden">
        <Header />
        <MainSection newNote={newNote} placeholder={placeholder} />
        <LoginComponent />
        <SignUpComponent />
      </div>
      <WarningToastComponent />
      {user && !noteView && !newNote && <NewNoteIcon />}
    </>
  );
}
