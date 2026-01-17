import { useContext } from "react";
import { NotesContext } from "../context/NotesContext.js";
import { toast } from "react-toastify";
import { VITE_BACKEND_URL } from "../utils/constants.js";
import { useIsMobile } from "../hooks/use-mobile.jsx";
import NotesContainer from "./NotesContainer.jsx";
import { LogIn, LogOut } from "lucide-react";
import Button from "../ui/button.jsx";

const Sidebar = () => {
  const {
    user,
    setUser,
    setUserLoggedIn,
    setOpenAuthComponent,
    setNewNote,
    setPlaceholder,
    // allNotes,
    setAllNotes,
    setNoteView,
    // setCurrentSelectedNote,
    // setCurrentSelectedNoteID,
    authenticating,
    setAuthenticating,
    notesContainer,
    setNotesContainer,
  } = useContext(NotesContext);

  const isMobile = useIsMobile();

  // console.log("isMobile", isMobile);

  // const notesContainerRef = useRef(null);

  // const handleNewNoteButton = () => {
  //   setNewNote(true);
  //   setPlaceholder(false);
  //   setNoteView(false);
  // };

  function goHome() {
    setNewNote(false);
    setPlaceholder(true);
    setNoteView(false);
    isMobile && setNotesContainer(true);
  }

  // function handleNotesContainer() {
  //   const { current } = notesContainerRef;
  //   current.classList.toggle("active"); // Toggle the active class
  // }

  // const renderNoteView = (note) => {
  //   setCurrentSelectedNote(note);
  //   setCurrentSelectedNoteID(note.id);
  //   setNewNote(false);
  //   setPlaceholder(false);
  //   setNoteView(true);
  //   // handleNotesContainer();
  // };

  async function handleUserLogOut() {
    setAuthenticating(true);
    try {
      const url = `${VITE_BACKEND_URL}/auth/logout`;

      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error in fetch request");
      }

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setUser(null);
        setUserLoggedIn(false);
        setAllNotes([]);
        setNoteView(false);
        setPlaceholder(true);
      }
    } catch (error) {
      console.error("Error occurred in handleUserLogOut:", error);
      toast.error(`Error while logging out => ${error.message}`);
    } finally {
      setAuthenticating(false);
    }
  }

  return (
    <section className="sidebar">
      <div className="logo" onClick={goHome}>
        <img src="./logo-main.png" alt="Logo" className="app-logo" />
        {/* <img
          src="./list.png"
          alt="Menu Icon"
          className="menu-icon"
          // onClick={handleNotesContainer}
        /> */}
        <h1>NOTELAND</h1>
      </div>

      {!isMobile && notesContainer && <NotesContainer />}
      <div className="w-full flex items-center justify-center">
        {user ? (
          <Button
            // className="auth-btn"
            onClick={handleUserLogOut}
            isLoading={authenticating}
            leftSection={<LogOut size={14} />}
            variant={"info"}
            // className={"self-center"}
          >
            Logout
            {/* {authenticating ? (
            <p>Please wait...</p>
          ) : (
            <div className="auth-btn-sidebar">
              
              <span>Logout</span>
            </div>
          )} */}
          </Button>
        ) : (
          <Button
            // className="auth-btn auth-btn-sidebar"
            onClick={() => setOpenAuthComponent(true)}
            leftSection={<LogIn size={14} />}
            variant={"info"}
            // className={"self-center"}
          >
            Login
          </Button>
        )}
      </div>
    </section>
  );
};

export default Sidebar;
