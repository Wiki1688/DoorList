import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Attendee } from '../types';

interface PaymentModalProps {
  attendee: Attendee | null;
  onConfirm: (attendeeId: string) => void;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  attendee,
  onConfirm,
  onClose,
}) => {
  if (!attendee) return null;

  return (
    <div
      id="payment-confirmation-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="payment-confirmation-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-dialog-title"
        className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning Icon & Heading */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3
              id="payment-dialog-title"
              className="text-lg font-bold text-slate-900 leading-snug"
            >
              Payment confirmed at desk?
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Attendee payment is currently unconfirmed.
            </p>
          </div>
        </div>

        {/* Attendee Details Box */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 mb-5">
          <div className="text-base font-bold text-slate-900 leading-tight">
            {attendee.name}
          </div>
          <div className="text-xs text-slate-600 font-medium mt-0.5">
            {attendee.organisation}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
              {attendee.ticketType} Ticket
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
              Payment Unconfirmed
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            id="btn-confirm-check-in"
            type="button"
            onClick={() => onConfirm(attendee.id)}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-sm transition-colors touch-manipulation min-h-[48px] flex items-center justify-center"
          >
            Confirmed - check in
          </button>
          <button
            id="btn-cancel-check-in"
            type="button"
            onClick={onClose}
            className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-semibold text-sm rounded-xl transition-colors touch-manipulation min-h-[44px] flex items-center justify-center"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
