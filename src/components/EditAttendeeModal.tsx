import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, X, AlertCircle } from 'lucide-react';
import { TicketType, PaymentStatus, Attendee } from '../types';

interface EditAttendeeModalProps {
  attendee: Attendee | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateAttendee: (updated: Attendee) => void;
  onDeleteAttendee: (attendeeId: string) => void;
}

export const EditAttendeeModal: React.FC<EditAttendeeModalProps> = ({
  attendee,
  isOpen,
  onClose,
  onUpdateAttendee,
  onDeleteAttendee,
}) => {
  const [name, setName] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [ticketType, setTicketType] = useState<TicketType>('Standard');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Paid');
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (attendee) {
      setName(attendee.name);
      setOrganisation(attendee.organisation);
      setTicketType(attendee.ticketType);
      setPaymentStatus(attendee.paymentStatus);
      setIsCheckedIn(attendee.isCheckedIn);
      setConfirmDelete(false);
      setError('');
    }
  }, [attendee, isOpen]);

  if (!isOpen || !attendee) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter attendee name.');
      return;
    }
    if (!organisation.trim()) {
      setError('Please enter attendee organisation.');
      return;
    }

    onUpdateAttendee({
      ...attendee,
      name: name.trim(),
      organisation: organisation.trim(),
      ticketType,
      paymentStatus,
      isCheckedIn,
    });

    onClose();
  };

  const handleDelete = () => {
    onDeleteAttendee(attendee.id);
    onClose();
  };

  return (
    <div
      id="edit-attendee-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="edit-attendee-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-attendee-title"
        className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Edit2 className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h3
                id="edit-attendee-title"
                className="text-lg font-bold text-slate-900 leading-tight"
              >
                Modify Attendee Details
              </h3>
              <p className="text-xs text-slate-500">
                Update or remove attendee from list
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmDelete ? (
          <div className="space-y-4 py-2">
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-900">
                  Delete {attendee.name}?
                </p>
                <p className="text-xs text-red-700 mt-1">
                  This will permanently remove this attendee from the attendee list.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                id="btn-confirm-delete-attendee"
                type="button"
                onClick={handleDelete}
                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-sm rounded-xl shadow-xs transition-colors touch-manipulation min-h-[46px] flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Delete Attendee</span>
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors touch-manipulation min-h-[46px]"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="edit-attendee-name"
                className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider"
              >
                Full Name *
              </label>
              <input
                id="edit-attendee-name"
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-slate-900 text-sm font-medium focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition-all touch-manipulation min-h-[44px]"
              />
            </div>

            <div>
              <label
                htmlFor="edit-attendee-org"
                className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider"
              >
                Organisation *
              </label>
              <input
                id="edit-attendee-org"
                type="text"
                required
                value={organisation}
                onChange={(e) => {
                  setOrganisation(e.target.value);
                  if (error) setError('');
                }}
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-slate-900 text-sm font-medium focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition-all touch-manipulation min-h-[44px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="edit-attendee-ticket"
                  className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider"
                >
                  Ticket Type
                </label>
                <select
                  id="edit-attendee-ticket"
                  value={ticketType}
                  onChange={(e) => setTicketType(e.target.value as TicketType)}
                  className="w-full px-3 py-2.5 bg-white rounded-xl border border-slate-300 text-slate-900 text-sm font-medium focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition-all touch-manipulation min-h-[44px]"
                >
                  <option value="Standard">Standard</option>
                  <option value="Student">Student</option>
                  <option value="Speaker">Speaker</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="edit-attendee-payment"
                  className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider"
                >
                  Payment Status
                </label>
                <select
                  id="edit-attendee-payment"
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                  className="w-full px-3 py-2.5 bg-white rounded-xl border border-slate-300 text-slate-900 text-sm font-medium focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition-all touch-manipulation min-h-[44px]"
                >
                  <option value="Paid">Paid</option>
                  <option value="Unconfirmed">Unconfirmed</option>
                </select>
              </div>
            </div>

            {/* Check-in state toggle */}
            <div className="pt-1">
              <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCheckedIn}
                  onChange={(e) => setIsCheckedIn(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <span>Checked In status</span>
              </label>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                id="btn-save-edit-attendee"
                type="submit"
                className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm rounded-xl shadow-xs transition-colors touch-manipulation min-h-[46px] flex items-center justify-center gap-1.5"
              >
                Save Changes
              </button>
              <button
                id="btn-trigger-delete-attendee"
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="py-3 px-4 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-sm rounded-xl border border-red-200 transition-colors touch-manipulation min-h-[46px] flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
                <span>Delete</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
