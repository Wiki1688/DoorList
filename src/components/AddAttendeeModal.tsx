import React, { useState } from 'react';
import { UserPlus, X } from 'lucide-react';
import { TicketType, PaymentStatus, Attendee } from '../types';

interface AddAttendeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAttendee: (newAttendee: Omit<Attendee, 'id' | 'isCheckedIn'>) => void;
}

export const AddAttendeeModal: React.FC<AddAttendeeModalProps> = ({
  isOpen,
  onClose,
  onAddAttendee,
}) => {
  const [name, setName] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [ticketType, setTicketType] = useState<TicketType>('Standard');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Paid');
  const [error, setError] = useState('');

  if (!isOpen) return null;

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

    onAddAttendee({
      name: name.trim(),
      organisation: organisation.trim(),
      ticketType,
      paymentStatus,
    });

    // Reset and close
    setName('');
    setOrganisation('');
    setTicketType('Standard');
    setPaymentStatus('Paid');
    setError('');
    onClose();
  };

  return (
    <div
      id="add-attendee-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="add-attendee-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-attendee-title"
        className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <UserPlus className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3
                id="add-attendee-title"
                className="text-lg font-bold text-slate-900 leading-tight"
              >
                Add New Attendee
              </h3>
              <p className="text-xs text-slate-500">
                Register a walk-in or new arrival
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="new-attendee-name"
              className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider"
            >
              Full Name *
            </label>
            <input
              id="new-attendee-name"
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Alex Morgan"
              className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all touch-manipulation min-h-[44px]"
            />
          </div>

          <div>
            <label
              htmlFor="new-attendee-org"
              className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider"
            >
              Organisation *
            </label>
            <input
              id="new-attendee-org"
              type="text"
              required
              value={organisation}
              onChange={(e) => {
                setOrganisation(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Metro Robotics Guild"
              className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all touch-manipulation min-h-[44px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="new-attendee-ticket"
                className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider"
              >
                Ticket Type
              </label>
              <select
                id="new-attendee-ticket"
                value={ticketType}
                onChange={(e) => setTicketType(e.target.value as TicketType)}
                className="w-full px-3 py-2.5 bg-white rounded-xl border border-slate-300 text-slate-900 text-sm font-medium focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all touch-manipulation min-h-[44px]"
              >
                <option value="Standard">Standard</option>
                <option value="Student">Student</option>
                <option value="Speaker">Speaker</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="new-attendee-payment"
                className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider"
              >
                Payment Status
              </label>
              <select
                id="new-attendee-payment"
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                className="w-full px-3 py-2.5 bg-white rounded-xl border border-slate-300 text-slate-900 text-sm font-medium focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all touch-manipulation min-h-[44px]"
              >
                <option value="Paid">Paid</option>
                <option value="Unconfirmed">Unconfirmed</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              id="btn-submit-new-attendee"
              type="submit"
              className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-xs transition-colors touch-manipulation min-h-[46px] flex items-center justify-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Attendee</span>
            </button>
            <button
              id="btn-cancel-new-attendee"
              type="button"
              onClick={onClose}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors touch-manipulation min-h-[46px]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
