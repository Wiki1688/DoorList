import React from 'react';
import { Check, AlertCircle, Edit2 } from 'lucide-react';
import { Attendee } from '../types';

interface AttendeeRowProps {
  attendee: Attendee;
  onRowClick: (attendee: Attendee) => void;
  onEditAttendee?: (attendee: Attendee) => void;
}

export const AttendeeRow: React.FC<AttendeeRowProps> = ({
  attendee,
  onRowClick,
  onEditAttendee,
}) => {
  const isCheckedIn = attendee.isCheckedIn;
  const isPaid = attendee.paymentStatus === 'Paid';

  // Badge styling for ticket types
  const getTicketBadge = (type: string) => {
    switch (type) {
      case 'Speaker':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Student':
        return 'bg-violet-100 text-violet-900 border-violet-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div
      id={`attendee-row-${attendee.id}`}
      role="button"
      tabIndex={0}
      onClick={() => onRowClick(attendee)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onRowClick(attendee);
        }
      }}
      className={`group relative w-full text-left rounded-xl border transition-all duration-150 p-4 select-none cursor-pointer active:scale-[0.99] touch-manipulation min-h-[72px] flex items-center justify-between gap-3 ${
        isCheckedIn
          ? 'bg-slate-100/80 border-slate-200 opacity-60 hover:opacity-80'
          : isPaid
          ? 'bg-white border-slate-200 hover:border-emerald-400 hover:shadow-sm'
          : 'bg-white border-amber-300 ring-1 ring-amber-300/60 hover:border-amber-400 hover:shadow-sm'
      }`}
      aria-label={`${attendee.name}, ${attendee.organisation}, ${attendee.ticketType}, ${attendee.paymentStatus}. Status: ${
        isCheckedIn ? 'Checked in' : 'Not checked in'
      }. Tap to toggle.`}
    >
      {/* Left side: Attendee Info */}
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h2
            className={`text-base sm:text-lg font-bold truncate leading-snug ${
              isCheckedIn ? 'text-slate-500 line-through' : 'text-slate-900'
            }`}
          >
            {attendee.name}
          </h2>

          {/* Ticket Type Pill */}
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border whitespace-nowrap ${getTicketBadge(
              attendee.ticketType
            )}`}
          >
            {attendee.ticketType}
          </span>
        </div>

        {/* Organisation */}
        <p
          className={`text-xs sm:text-sm font-medium truncate mb-2 ${
            isCheckedIn ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          {attendee.organisation}
        </p>

        {/* Payment Status Indicator */}
        <div className="flex items-center gap-2">
          {isPaid ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 whitespace-nowrap">
              Paid
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded border border-amber-300 whitespace-nowrap">
              <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
              Unconfirmed
            </span>
          )}

          {isCheckedIn && (
            <span className="text-[11px] font-medium text-slate-500 italic">
              (Checked in — tap to undo)
            </span>
          )}
        </div>
      </div>

      {/* Right side: Actions (Edit & Check-in Status Action Indicator) */}
      <div className="shrink-0 flex items-center gap-2">
        {onEditAttendee && (
          <button
            id={`btn-edit-attendee-${attendee.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEditAttendee(attendee);
            }}
            className="w-9 h-9 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors touch-manipulation cursor-pointer"
            title="Edit attendee details"
            aria-label={`Edit ${attendee.name} details`}
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}

        {isCheckedIn ? (
          <div
            className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm"
            title="Checked in (tap to undo)"
          >
            <Check className="w-6 h-6 stroke-[3]" />
          </div>
        ) : isPaid ? (
          <div
            className="w-11 h-11 rounded-full border-2 border-slate-300 text-transparent group-hover:border-emerald-500 flex items-center justify-center transition-colors"
            title="Tap to check in"
          >
            <Check className="w-6 h-6 text-slate-300 group-hover:text-emerald-500 transition-colors" />
          </div>
        ) : (
          <div
            className="px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold text-center leading-tight shadow-2xs"
            title="Tap to verify payment"
          >
            <span>Verify</span>
          </div>
        )}
      </div>
    </div>
  );
};
