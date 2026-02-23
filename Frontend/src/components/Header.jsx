import { useContext } from "react";
import { NotesContext } from "../context/NotesContext";
import { useIsMobile } from "../hooks/use-mobile";
import Button from "../ui/button";
import { toast } from "react-toastify";
import { VITE_BACKEND_URL } from "../utils/constants";
import { LogIn, LogOut } from "lucide-react";

export default function Header() {
  const {
    user,
    setNewNote,
    setPlaceholder,
    setNoteView,
    setNotesContainer,
    setUser,
    setUserLoggedIn,
    authenticating,
    setAuthenticating,
    setAllNotes,
    setOpenAuthComponent,
  } = useContext(NotesContext);

  function goHome() {
    setNewNote(false);
    setPlaceholder(true);
    setNoteView(false);
    useIsMobile && setNotesContainer(true);
  }

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
    <header className="bg-primary flex items-center justify-between w-full py-2 px-3">
      <div className="flex items-center gap-2">
        <img src="./logo-main.png" alt="Logo" className="w-10 h-10" />
        <h1
          className="font-bold hover:underline cursor-pointer"
          onClick={goHome}
        >
          NOTELAND
        </h1>
      </div>

      <div>
        {user ? (
          <Button
            onClick={handleUserLogOut}
            isLoading={authenticating}
            leftSection={<LogOut size={14} />}
            variant={"info"}
          >
            Logout
          </Button>
        ) : (
          <Button
            onClick={() => setOpenAuthComponent(true)}
            leftSection={<LogIn size={14} />}
            variant={"info"}
          >
            Login
          </Button>
        )}
      </div>
    </header>
  );
}
