import React, { useState, useEffect } from 'react';
import { Screen, FilterOption, Attendee } from './types';
import { INITIAL_ATTENDEES } from './data/attendees';
import { HeaderNav } from './components/HeaderNav';
import { DeskScreen } from './components/DeskScreen';
import { SummaryScreen } from './components/SummaryScreen';
import { PaymentModal } from './components/PaymentModal';
import { AddAttendeeModal } from './components/AddAttendeeModal';
import { EditAttendeeModal } from './components/EditAttendeeModal';

const STORAGE_KEY_ATTENDEES = 'doorlist_attendees_v1';
const STORAGE_KEY_FILTER = 'doorlist_filter_v1';

export default function App() {
  // Screen state: 'desk' | 'summary'
  const [currentScreen, setCurrentScreen] = useState<Screen>('desk');

  // Filter state persisted in localStorage per prompt requirement:
  // "The selected filter is remembered when the page is closed and reopened."
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FILTER);
      if (
        saved === 'All' ||
        saved === 'Not arrived' ||
        saved === 'Checked in' ||
        saved === 'Flagged'
      ) {
        return saved;
      }
    } catch {
      // ignore storage read issues
    }
    return 'All';
  });

  // Attendees state with localStorage backup so volunteers don't lose check-ins on phone reload
  const [attendees, setAttendees] = useState<Attendee[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ATTENDEES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback to initial data
    }
    return INITIAL_ATTENDEES;
  });

  // Pending attendee for payment confirmation modal
  const [confirmingAttendee, setConfirmingAttendee] = useState<Attendee | null>(null);

  // Add attendee modal open/close state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Editing attendee state
  const [editingAttendee, setEditingAttendee] = useState<Attendee | null>(null);

  // Persist filter change
  const handleFilterChange = (filter: FilterOption) => {
    setSelectedFilter(filter);
    try {
      localStorage.setItem(STORAGE_KEY_FILTER, filter);
    } catch {
      // ignore
    }
  };

  // Persist attendees changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ATTENDEES, JSON.stringify(attendees));
    } catch {
      // ignore
    }
  }, [attendees]);

  // Toggle check-in for Paid attendees (or undo)
  const handleToggleCheckIn = (attendeeId: string) => {
    setAttendees((prev) =>
      prev.map((att) => {
        if (att.id === attendeeId) {
          return {
            ...att,
            isCheckedIn: !att.isCheckedIn,
          };
        }
        return att;
      })
    );
  };

  // Flag attendee as unpaid / unconfirmed (if not paid or confirmed check-in wrongly)
  const handleFlagAttendee = (attendeeId: string) => {
    setAttendees((prev) =>
      prev.map((att) => {
        if (att.id === attendeeId) {
          return {
            ...att,
            paymentStatus: 'Unconfirmed',
            isCheckedIn: false,
          };
        }
        return att;
      })
    );
  };

  // Confirm payment at desk for an Unconfirmed attendee
  const handleConfirmPaymentAtDesk = (attendeeId: string) => {
    setAttendees((prev) =>
      prev.map((att) => {
        if (att.id === attendeeId) {
          return {
            ...att,
            paymentStatus: 'Paid',
            isCheckedIn: true,
          };
        }
        return att;
      })
    );
    setConfirmingAttendee(null);
  };

  // Add a new attendee to list
  const handleAddNewAttendee = (
    newAttendeeData: Omit<Attendee, 'id' | 'isCheckedIn'>
  ) => {
    const newAttendee: Attendee = {
      ...newAttendeeData,
      id: `att-custom-${Date.now()}`,
      isCheckedIn: false,
    };
    setAttendees((prev) => [newAttendee, ...prev]);
  };

  // Modify attendee details
  const handleUpdateAttendee = (updated: Attendee) => {
    setAttendees((prev) =>
      prev.map((att) => (att.id === updated.id ? updated : att))
    );
  };

  // Delete attendee from list
  const handleDeleteAttendee = (attendeeId: string) => {
    setAttendees((prev) => prev.filter((att) => att.id !== attendeeId));
  };

  const checkedInCount = attendees.filter((a) => a.isCheckedIn).length;
  const flaggedCount = attendees.filter(
    (a) => a.paymentStatus === 'Unconfirmed' && !a.isCheckedIn
  ).length;
  const totalAttendeesCount = attendees.length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Header Navigation */}
      <HeaderNav
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
        flaggedCount={flaggedCount}
      />

      {/* Main Content Area: Desk or Summary */}
      <main className="flex-1 pb-12">
        {currentScreen === 'desk' ? (
          <DeskScreen
            attendees={attendees}
            selectedFilter={selectedFilter}
            onFilterChange={handleFilterChange}
            onToggleCheckIn={handleToggleCheckIn}
            onFlagAttendee={handleFlagAttendee}
            onRequestConfirmPayment={(att) => setConfirmingAttendee(att)}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onEditAttendee={(att) => setEditingAttendee(att)}
            totalAttendeesCount={totalAttendeesCount}
            checkedInCount={checkedInCount}
          />
        ) : (
          <SummaryScreen
            attendees={attendees}
            totalExpectedCount={totalAttendeesCount}
            onBackToDesk={() => setCurrentScreen('desk')}
            onRequestConfirmPayment={(att) => setConfirmingAttendee(att)}
          />
        )}
      </main>

      {/* Payment Confirmation Modal */}
      <PaymentModal
        attendee={confirmingAttendee}
        onConfirm={handleConfirmPaymentAtDesk}
        onClose={() => setConfirmingAttendee(null)}
      />

      {/* Add Attendee Modal */}
      <AddAttendeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddAttendee={handleAddNewAttendee}
      />

      {/* Edit/Delete Attendee Modal */}
      <EditAttendeeModal
        attendee={editingAttendee}
        isOpen={Boolean(editingAttendee)}
        onClose={() => setEditingAttendee(null)}
        onUpdateAttendee={handleUpdateAttendee}
        onDeleteAttendee={handleDeleteAttendee}
      />
    </div>
  );
}
