import { de, is } from "zod/v4/locales"
import Modal from "./modal"
import { Button } from "./button"



interface SaveModalProps {
    isOpen: boolean,
    onClose: () => void
    onConfirm: () => void
    loading: boolean
}

export const SaveModal = ({
    isOpen, onClose, onConfirm, loading }: SaveModalProps) => {
    return (
    <Modal
      title="Are you sure?"
      description="This will save your changes."
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      loading={loading}
    >
      <div className="pt-6 flex items-center justify-end w-full space-x-2">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} onClick={onConfirm} className="bg-emerald-600:bg-emerald-800">
          Continue
        </Button>
      </div>
    </Modal>
    )
}
export default SaveModal;