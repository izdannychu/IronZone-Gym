import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { X } from 'lucide-react';

export const Modal = ({ open, onClose, title, subtitle, children, size = 'default' }) => (
  <Dialog open={open} onClose={onClose} className="relative z-50">
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md" aria-hidden="true" />
    <div className="fixed inset-0 overflow-hidden">
      <div className="flex min-h-full items-center justify-center p-3 sm:p-5">
        <DialogPanel className={`my-auto w-full overflow-hidden rounded-2xl border border-white/10 bg-[#090909] text-white shadow-2xl shadow-black/80 ring-1 ring-white/[0.03] ${
          size === 'wide' ? 'max-w-6xl' : 'max-w-lg'
        }`}>
          <div className="flex items-center justify-between gap-5 border-b border-white/10 bg-gradient-to-r from-white/[0.035] via-transparent to-primary/[0.035] px-5 py-4 sm:px-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-primary">IronZone Admin</p>
              <DialogTitle className="mt-1.5 text-2xl font-black leading-tight">{title}</DialogTitle>
              {subtitle && <p className="mt-1 hidden text-xs text-zinc-500 sm:block">{subtitle}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-black/30 text-zinc-400 hover:border-primary hover:bg-primary hover:text-black"
            >
              <X size={18} />
            </button>
          </div>
          {children}
        </DialogPanel>
      </div>
    </div>
  </Dialog>
);
