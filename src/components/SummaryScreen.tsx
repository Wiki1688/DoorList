import React from 'react';
import { AlertTriangle, CheckCircle2, Users, ShieldAlert } from 'lucide-react';
import { Attendee } from '../types';

interface SummaryScreenProps {
  attendees: Attendee[];
  totalExpectedCount: number;
  onBackToDesk?: () => void;
  onRequestConfirmPayment?: (attendee: Attendee) => void;
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({
  attendees,
  totalExpectedCount,
  onRequestConfirmPayment,
}) => {
  const checkedInCount = attendees.filter((a) => a.isCheckedIn).length;
  // Flagged attendees are those with unconfirmed payment who have not yet had payment confirmed
  const flaggedAttendees = attendees.filter(
    (a) => a.paymentStatus === 'Unconfirmed'
  );
  const flaggedCount = flaggedAttendees.length;

  return (
    <div id="summary-screen-container" className="max-w-3xl mx-auto px-4 py-5 space-y-6">
      {/* Top Bar: Summary Overview */}
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider">
          Summary Overview
        </span>
      </div>

      {/* 3 Large Numbers: Readable from two metres away */}
      <section
        id="summary-stats-section"
        aria-label="High-visibility summary metrics"
        className="grid grid-cols-1 sm:grid-cols-3 gap-3.5"
      >
        {/* Metric 1: Checked In */}
        <div
          id="stat-checked-in"
          className="bg-white rounded-2xl p-5 border-2 border-emerald-500/80 shadow-sm flex flex-col items-center justify-center text-center min-h-[160px]"
        >
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black uppercase tracking-widest text-emerald-800 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Checked In</span>
          </div>
          <div className="text-6xl sm:text-7xl font-black text-emerald-700 tracking-tight leading-none my-1">
            {checkedInCount}
          </div>
          <div className="text-xs font-semibold text-slate-500 mt-1">
            Attendees arrived
          </div>
        </div>

        {/* Metric 2: Expected */}
        <div
          id="stat-expected"
          className="bg-white rounded-2xl p-5 border-2 border-slate-300 shadow-sm flex flex-col items-center justify-center text-center min-h-[160px]"
        >
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black uppercase tracking-widest text-slate-700 mb-1">
            <Users className="w-4 h-4 text-slate-500 shrink-0" />
            <span>Expected</span>
          </div>
          <div className="text-6xl sm:text-7xl font-black text-slate-900 tracking-tight leading-none my-1">
            {totalExpectedCount}
          </div>
          <div className="text-xs font-semibold text-slate-500 mt-1">
            Total registered
          </div>
        </div>

        {/* Metric 3: Flagged Unconfirmed */}
        <div
          id="stat-flagged-unconfirmed"
          className="bg-white rounded-2xl p-5 border-2 border-amber-400 shadow-sm flex flex-col items-center justify-center text-center min-h-[160px]"
        >
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black uppercase tracking-widest text-amber-900 mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Flagged Unconfirmed</span>
          </div>
          <div className="text-6xl sm:text-7xl font-black text-amber-600 tracking-tight leading-none my-1">
            {flaggedCount}
          </div>
          <div className="text-xs font-semibold text-amber-800 mt-1">
            Payment pending
          </div>
        </div>
      </section>

      {/* Check-in Progress Bar & Percentage */}
      <section
        id="summary-progress-section"
        aria-label="Overall check-in progress"
        className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm sm:text-base font-bold text-slate-800">
            Check-in Progress
          </span>
          <span className="text-base sm:text-lg font-black text-emerald-700">
            {totalExpectedCount > 0
              ? `${Math.round((checkedInCount / totalExpectedCount) * 100)}%`
              : '0%'}
          </span>
        </div>
        <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
            style={{
              width: `${
                totalExpectedCount > 0
                  ? Math.min(100, (checkedInCount / totalExpectedCount) * 100)
                  : 0
              }%`,
            }}
          />
        </div>
      </section>

      {/* Flagged Attendees List: Readable from 2 metres away */}
      <section
        id="summary-flagged-list-section"
        className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4"
        aria-label="Flagged unconfirmed attendees list"
      >
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                Flagged Attendees ({flaggedAttendees.length})
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Payment unconfirmed at entrance table
              </p>
            </div>
          </div>
        </div>

        {flaggedAttendees.length > 0 ? (
          <div className="space-y-3">
            {flaggedAttendees.map((attendee) => (
              <div
                key={attendee.id}
                id={`flagged-attendee-${attendee.id}`}
                className="rounded-xl border-2 border-amber-300 bg-amber-50/40 p-4 transition-all hover:border-amber-400"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    {/* Name: extra large and bold for distance reading */}
                    <div className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                      {attendee.name}
                    </div>

                    {/* Organisation: clearly readable at distance */}
                    <div className="text-sm sm:text-base font-semibold text-slate-700">
                      {attendee.organisation}
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-white border border-slate-300 text-slate-800">
                        {attendee.ticketType} Ticket
                      </span>
                      <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-amber-200/80 border border-amber-400 text-amber-950 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-700 inline" />
                        Unconfirmed Payment
                      </span>
                      {attendee.isCheckedIn && (
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Checked In
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quick verification action if passed */}
                  {onRequestConfirmPayment && !attendee.isCheckedIn && (
                    <button
                      type="button"
                      onClick={() => onRequestConfirmPayment(attendee)}
                      className="shrink-0 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-xs touch-manipulation min-h-[44px]"
                    >
                      Confirm & Check In
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">
              No Flagged Attendees
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              All currently registered attendees have either confirmed their payment or no unconfirmed payments remain.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
