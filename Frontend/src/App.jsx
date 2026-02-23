import { useEffect, useState, useRef } from "react";
import { NotesContext } from "./context/NotesContext";
import MainSection from "./components/MainSection";
import AuthComponent from "./components/AuthComponent";
import NewNoteIcon from "./components/NewNoteIcon";
import "./styles/mobile.css";
import "./styles/tab.css";
import "./styles/desktop.css";
import Header from "./components/Header";
import { apiEndPoints } from "./utils/apiEndpoints";

function App() {
  const [user, setUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const [allNotes, setAllNotes] = useState([]);
  const [refreshNotes, setRefreshNotes] = useState(false);

  const [placeholder, setPlaceholder] = useState(true);
  const [newNote, setNewNote] = useState(false);
  const [currentSelectedNote, setCurrentSelectedNote] = useState({});
  const [currentSelectedNoteID, setCurrentSelectedNoteID] = useState(0);
  const [noteView, setNoteView] = useState(false);
  const [noteViewKind, setNoteViewKind] = useState("");
  const [notesContainer, setNotesContainer] = useState(true);

  const [openAuthComponent, setOpenAuthComponent] = useState(false);

  const [authenticating, setAuthenticating] = useState(false);

  const authComponentRef = useRef(null);

  useEffect(() => {
    async function initMe() {
      try {
        const response = await fetch(apiEndPoints.ME, {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUserLoggedIn(data.isLoggedIn);
        }
      } catch (error) {
        console.error("Error in initMe function", error);
      }
    }

    initMe();
  }, []);

  async function safeFetch(url, signal) {
    const res = await fetch(url, { credentials: "include", signal });
    if (!res.ok) {
      throw new Error(`Failed request: ${res.status} ${res.statusText}`);
    }
    return res.json();
  }

  useEffect(() => {
    if (!userLoggedIn) return;

    const controller = new AbortController();

    (async function () {
      try {
        const [userResponse, userNotesResponse] = await Promise.all([
          safeFetch(apiEndPoints.GET_USER, controller.signal),
          safeFetch(apiEndPoints.GET_USER_NOTES, controller.signal),
        ]);

        if (userResponse.success) {
          setUser(userResponse.user);
          setUserLoggedIn(true);
        }

        if (userNotesResponse.success) {
          setAllNotes(userNotesResponse.notes);
        }
      } catch (error) {
        console.error("Error fetching data for the user", error);
        setUser(null);
        setUserLoggedIn(false);
        setAllNotes([]);
      }
    })();

    () => {
      controller.abort();
    };
  }, [refreshNotes, userLoggedIn]);

  useEffect(() => {
    if (currentSelectedNoteID) {
      setCurrentSelectedNote(() =>
        allNotes?.find((note) => note.id === currentSelectedNoteID),
      );
    }
  }, [allNotes, currentSelectedNoteID]);

  return (
    <NotesContext.Provider
      value={{
        user,
        setUser,
        userLoggedIn,
        setUserLoggedIn,
        openAuthComponent,
        setOpenAuthComponent,
        authComponentRef,
        allNotes,
        setAllNotes,
        placeholder,
        setPlaceholder,
        newNote,
        setNewNote,
        currentSelectedNote,
        setCurrentSelectedNote,
        noteView,
        setNoteView,
        refreshNotes,
        setRefreshNotes,
        currentSelectedNoteID,
        setCurrentSelectedNoteID,
        authenticating,
        setAuthenticating,
        notesContainer,
        setNotesContainer,
        noteViewKind,
        setNoteViewKind,
      }}
    >
      <div className="flex flex-col relative min-h-dvh">
        <Header />
        <MainSection newNote={newNote} placeholder={placeholder} />
        <AuthComponent />
        {user && !noteView && !newNote && <NewNoteIcon />}
      </div>
    </NotesContext.Provider>
  );
}

export default App;
