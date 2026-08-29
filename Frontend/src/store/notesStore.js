import { create } from "zustand";
import { apiEndPoints } from "../utils/apiEndpoints";

export const useNotesStore = create((set) => ({
  allNotes: [],
  notesLoading: false,
  placeholder: true,
  newNote: false,
  currentSelectedNoteID: 0,
  currentSelectedNote: null,
  noteView: false,
  noteViewKind: "",
  notesContainer: true,
  openTaskDialog: false,
  openActionItemPopup: false,
  actionItemHelperData: null,

  setNewNote: (val) => set({ newNote: val }),
  setPlaceholder: (val) => set({ placeholder: val }),
  setNoteView: (val) => set({ noteView: val }),
  setNoteViewKind: (val) => set({ noteViewKind: val }),
  setNotesContainer: (val) => set({ notesContainer: val }),
  setOpenTaskDialog: (val) => set({ openTaskDialog: val }),
  setCurrentSelectedNoteID: (id) => set({ currentSelectedNoteID: id }),
  setCurrentSelectedNote: (val) => set({ currentSelectedNote: val }),
  setOpenActionItemPopup: (val) => set({ openActionItemPopup: val }),
  setActionItemHelperData: (val) => set({ actionItemHelperData: val }),

  fetchNotes: async () => {
    try {
      set({ notesLoading: true });
      const res = await fetch(apiEndPoints.GET_USER_NOTES, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Failed request: ${res.status}`);
      const data = await res.json();
      if (data.success) set({ allNotes: data?.data });
    } catch (err) {
      console.error("Error fetching notes", err);
      set({ allNotes: [] });
    } finally {
      set({ notesLoading: false });
    }
  },

  resetOnLogout: () =>
    set({
      allNotes: [],
      noteView: false,
      placeholder: true,
      currentSelectedNoteID: 0,
    }),
}));

export const useCurrentSelectedNote = () =>
  useNotesStore((s) =>
    s.allNotes.find((n) => n.id === s.currentSelectedNoteID),
  );
