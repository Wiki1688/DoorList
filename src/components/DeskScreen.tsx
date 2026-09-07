import React, { useState, useMemo } from 'react';
import { Search, X, Users, AlertTriangle, UserPlus } from 'lucide-react';
import { Attendee, FilterOption } from '../types';
import { AttendeeRow } from './AttendeeRow';

interface DeskScreenProps {
  attendees: Attendee[];
  selectedFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
  onToggleCheckIn: (attendeeId: string) => void;
  onFlagAttendee: (attendeeId: string) => void;
  onRequestConfirmPayment: (attendee: Attendee) => void;
  onOpenAddModal: () => void;
  onEditAttendee: (attendee: Attendee) => void;
  totalAttendeesCount: number;
  checkedInCount: number;
}

export const DeskScreen: React.FC<DeskScreenProps> = ({
  attendees,
  selectedFilter,
  onFilterChange,
  onToggleCheckIn,
  onFlagAttendee,
  onRequestConfirmPayment,
  onOpenAddModal,
  onEditAttendee,
  totalAttendeesCount,
  checkedInCount,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate filter counts for the chips
  const counts = useMemo(() => {
    const checked = attendees.filter((a) => a.isCheckedIn).length;
    const notArrived = attendees.filter((a) => !a.isCheckedIn).length;
    const flagged = attendees.filter(
      (a) => a.paymentStatus === 'Unconfirmed' && !a.isCheckedIn
    ).length;
    return {
      all: attendees.length,
      notArrived,
      checked,
      flagged,
    };
  }, [attendees]);

  // Filter attendees based on selected filter chip and search query
  const filteredAttendees = useMemo(() => {
    return attendees.filter((attendee) => {
      // 1. Filter Chip Condition
      if (selectedFilter === 'Not arrived' && attendee.isCheckedIn) {
        return false;
      }
      if (selectedFilter === 'Checked in' && !attendee.isCheckedIn) {
        return false;
      }
      if (selectedFilter === 'Flagged' && attendee.paymentStatus !== 'Unconfirmed') {
        return false;
      }

      // 2. Search Query Condition
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = attendee.name.toLowerCase().includes(query);
        const matchesOrg = attendee.organisation.toLowerCase().includes(query);
        const matchesTicket = attendee.ticketType.toLowerCase().includes(query);
        return matchesName || matchesOrg || matchesTicket;
      }

      return true;
    });
  }, [attendees, selectedFilter, searchQuery]);

  const handleRowClick = (attendee: Attendee) => {
    if (attendee.paymentStatus === 'Paid') {
      onToggleCheckIn(attendee.id);
    } else {
      // Payment unconfirmed: if already checked in (was confirmed earlier), allow toggle undo
      if (attendee.isCheckedIn) {
        onToggleCheckIn(attendee.id);
      } else {
        // Not checked in and unconfirmed: show prompt
        onRequestConfirmPayment(attendee);
      }
    }
  };

  const filterButtons: { id: FilterOption; label: string; count: number }[] = [
    { id: 'All', label: 'All', count: counts.all },
    { id: 'Not arrived', label: 'Not arrived', count: counts.notArrived },
    { id: 'Checked in', label: 'Checked in', count: counts.checked },
    { id: 'Flagged', label: 'Flagged', count: counts.flagged },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
      {/* Top Banner: Counter & Arrival Rush Notice */}
      <section
        id="desk-counter-card"
        className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center justify-between gap-3"
        aria-label="Check-in counter"
      >
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-0.5">
            Arrival Counter
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight flex items-baseline gap-1.5">
            <span>Checked in</span>
            <span className="text-emerald-600 font-extrabold">
              {checkedInCount}
            </span>
            <span className="text-slate-400 font-medium">/</span>
            <span className="text-slate-800">{totalAttendeesCount}</span>
          </div>
        </div>

        <button
          id="btn-open-add-attendee"
          type="button"
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-2xs transition-colors touch-manipulation min-h-[44px]"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Attendee</span>
        </button>
      </section>

      {/* Search Input Box */}
      <section id="desk-search-section">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            id="attendee-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search attendee by name or organisation..."
            className="w-full pl-11 pr-10 py-3.5 bg-white rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 text-base font-medium shadow-2xs focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all touch-manipulation min-h-[48px]"
          />
          {searchQuery && (
            <button
              id="btn-clear-search"
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              aria-label="Clear search input"
            >
              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                <X className="w-3.5 h-3.5 text-slate-700" />
              </div>
            </button>
          )}
        </div>
      </section>

      {/* Filter Chips Bar */}
      <section id="desk-filter-chips" aria-label="Filter attendee list">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {filterButtons.map((chip) => {
            const isActive = selectedFilter === chip.id;
            return (
              <button
                key={chip.id}
                id={`filter-chip-${chip.id.toLowerCase().replace(/\s+/g, '-')}`}
                type="button"
                onClick={() => onFilterChange(chip.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all touch-manipulation min-h-[40px] border ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{chip.label}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? chip.id === 'Flagged' && chip.count > 0
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-800 text-slate-200'
                      : chip.id === 'Flagged' && chip.count > 0
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {chip.count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Attendees List */}
      <section id="desk-attendee-list" className="space-y-2.5 pb-10">
        {filteredAttendees.length > 0 ? (
          filteredAttendees.map((attendee) => (
            <AttendeeRow
              key={attendee.id}
              attendee={attendee}
              onRowClick={handleRowClick}
              onEditAttendee={onEditAttendee}
            />
          ))
        ) : (
          <div
            id="attendee-list-empty-state"
            className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-2 my-6"
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              {selectedFilter === 'Flagged' ? (
                <AlertTriangle className="w-6 h-6 text-amber-500" />
              ) : (
                <Users className="w-6 h-6" />
              )}
            </div>
            <h3 className="text-base font-bold text-slate-900">
              No attendees found
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
              {searchQuery
                ? `No matches for "${searchQuery}". Try another name or clear your search.`
                : `There are currently no attendees under the "${selectedFilter}" filter.`}
            </p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700 underline"
              >
                Clear search query
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
