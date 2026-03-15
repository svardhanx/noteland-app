import { useContext } from "react";
import { NotesContext } from "../context/NotesContext";
import { useIsMobile } from "../hooks/use-mobile";
import Button from "../ui/button";
import { toast } from "react-toastify";
import { LogIn, LogOut } from "lucide-react";
import { apiEndPoints } from "../utils/apiEndpoints";
import { useMutation } from "../hooks/use-mutation";

export default function Header() {
  const {
    user,
    setNewNote,
    setPlaceholder,
    setNoteView,
    setNotesContainer,
    setOpenLoginComponent,
    resetAfterLogout,
  } = useContext(NotesContext);

  function goHome() {
    setNewNote(false);
    setPlaceholder(true);
    setNoteView(false);
    useIsMobile && setNotesContainer(true);
  }

  const { mutate, isLoading } = useMutation();

  async function handleUserLogOut() {
    try {
      const url = apiEndPoints.LOGOUT;

      const result = await mutate(url, null, "POST");

      toast.success(result?.message);
      resetAfterLogout();
    } catch (error) {
      console.error("Error occurred in handleUserLogOut:", error);
      toast.error(`Error while logging out => ${error.message}`);
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
            isLoading={isLoading}
            leftSection={<LogOut size={14} />}
            variant={"info"}
          >
            Logout
          </Button>
        ) : (
          <Button
            onClick={() => setOpenLoginComponent(true)}
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
