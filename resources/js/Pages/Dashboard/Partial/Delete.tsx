import { useForm } from '@inertiajs/react';
import Modal from '../../../Components/Modal2';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function DeleteAccountModal({ isOpen, onClose, onSuccess }: DeleteAccountModalProps) {
  const { data, setData, delete: destroy, processing, errors } = useForm({
    password: '',
  });

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    destroy(route('profile.destroy'), {
      preserveScroll: true,
      onSuccess: () => {
        onClose();
        if (onSuccess) onSuccess();
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Account"
      size="md"
      footer={
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#F8E193] text-[#282725] border-2 border-[#282725] shadow-[-2px_4px_0px_#282725] transition hover:scale-105"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="delete-account-form"
            disabled={processing}
            className="px-4 py-2 bg-[#9A4112] text-white border-2 border-[#282725] shadow-[-2px_4px_0px_#282725] transition hover:scale-105 disabled:opacity-70"
          >
            {processing ? 'Deleting...' : 'Delete Account'}
          </button>
        </div>
      }
    >
      <p className="mb-6 text-[#3D2410]">
        Sigurado ka bang gusto mong burahin ang iyong account? Hindi na maaaring bawiin ang aksyon na ito.
      </p>

      <form id="delete-account-form" onSubmit={handleDelete}>
        <div className="mb-6">
          <label className="block text-sm font-bold mb-2 text-[#3D2410]">
            Password
          </label>
          <input
            type="password"
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            className="w-full px-4 py-2 bg-white/80 border-2 border-[#000] rounded"
            required
            autoFocus
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>
      </form>
    </Modal>
  );
}
