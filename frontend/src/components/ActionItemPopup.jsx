import { Modal } from "@mui/material";
import { useNotesStore } from "../store/notesStore";
import Button from "../ui/button";
import { toast } from "react-toastify";

export default function ActionItemPopup() {
  const openActionItemPopup = useNotesStore((s) => s.openActionItemPopup);

  const setOpenActionItemPopup = useNotesStore((s) => s.setOpenActionItemPopup);

  const actionItemHelperData = useNotesStore((s) => s.actionItemHelperData);

  const title = actionItemHelperData?.title;

  const leftButtonName = actionItemHelperData?.leftButtonName;

  const rightButtonName = actionItemHelperData?.rightButtonName;

  const fn = actionItemHelperData?.fn;

  const isPending = actionItemHelperData?.isPending;

  function handleClose() {
    if (isPending) return;
    setOpenActionItemPopup(false);
  }

  function handleClick() {
    if (fn === undefined || fn === null) return;

    if (fn && typeof fn !== "function") {
      toast.error("invalid action");
    }

    fn();
    handleClose();
  }

  return (
    <Modal
      open={openActionItemPopup}
      onClose={handleClose}
      className="flex flex-col items-center justify-center"
    >
      <div className="flex flex-col gap-3 p-4 bg-white border-2 border-white h-fit rounded-md w-xl">
        <h2 className="text-xl font-bold">
          {title ? title : "Are you sure you want to continue?"}
        </h2>

        <div className="p-2 flex items-center justify-end gap-2">
          <Button variant="success" onClick={handleClick} isLoading={isPending}>
            {leftButtonName ? leftButtonName : "Confirm"}
          </Button>

          <Button
            variant="error"
            onClick={handleClose}
            type={"button"}
            disabled={isPending}
          >
            {rightButtonName ? rightButtonName : "Cancel"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
