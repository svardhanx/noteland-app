import { useIsMobile } from "../hooks/use-mobile";
import Button from "../ui/button";
import { toast } from "react-toastify";
import { LogIn, LogOut } from "lucide-react";
import { apiEndPoints } from "../utils/apiEndpoints";
import { useMutation } from "../hooks/use-mutation";
import { Skeleton } from "@mui/material";
import { useAuthStore } from "../store/authStore";
import { useNotesStore } from "../store/notesStore";

export default function Header() {
  const userLoggedIn = useAuthStore((s) => s.userLoggedIn);
  const setOpenLoginComponent = useAuthStore((s) => s.setOpenLoginComponent);
  const logout = useAuthStore((s) => s.logout);
  const authChecked = useAuthStore((s) => s.authChecked);

  const notesLoading = useNotesStore((s) => s.notesLoading);
  const setNewNote = useNotesStore((s) => s.setNewNote);
  const setPlaceholder = useNotesStore((s) => s.setPlaceholder);
  const setNoteView = useNotesStore((s) => s.setNoteView);
  const setNotesContainer = useNotesStore((s) => s.setNotesContainer);
  const resetOnLogout = useNotesStore((s) => s.resetOnLogout);

  const isResolvingAuthOrNotes = !authChecked || notesLoading;

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
      logout();
      resetOnLogout();
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
        {isResolvingAuthOrNotes ? (
          <Skeleton variant="rounded" width={120} height={40} />
        ) : userLoggedIn ? (
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
