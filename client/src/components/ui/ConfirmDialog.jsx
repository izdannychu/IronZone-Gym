import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import { Modal } from './Modal';

export const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Xác nhận',
  loading = false,
  destructive = true,
}) => (
  <Modal open={open} onClose={loading ? () => {} : onClose} title={title}>
    <div className="p-6">
      <div className="flex gap-4">
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${
          destructive ? 'bg-red-500/15 text-red-400' : 'bg-primary/15 text-primary'
        }`}>
          <AlertTriangle size={21} />
        </span>
        <div>
          <h3 className="font-black">Hành động cần xác nhận</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
        </div>
      </div>
    </div>
    <div className="flex justify-end gap-3 border-t border-zinc-800 bg-black/30 px-6 py-4">
      <Button type="button" variant="outline" className="border-zinc-700 bg-transparent text-white" onClick={onClose} disabled={loading}>
        Hủy
      </Button>
      <Button
        type="button"
        loading={loading}
        onClick={onConfirm}
        className={destructive ? 'bg-red-500 text-white hover:bg-red-600' : ''}
      >
        {confirmLabel}
      </Button>
    </div>
  </Modal>
);
