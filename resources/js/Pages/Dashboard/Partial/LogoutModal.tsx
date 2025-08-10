import Modal from '../../../Components/Modal2';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Logout"
      size="sm"
    >
      <div className="text-[#3D2410]">
        <p className="mb-6">Are you sure you want to logout?</p>
        
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#F8E193] text-[#282725] border-2 border-[#282725] shadow-[-2px_4px_0px_#282725] transition hover:scale-105"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-[#9A4112] text-white border-2 border-[#282725] shadow-[-2px_4px_0px_#282725] transition hover:scale-105"
          >
            Logout
          </button>
        </div>
      </div>
    </Modal>
  );
}