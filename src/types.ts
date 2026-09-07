export type TicketType = 'Standard' | 'Student' | 'Speaker';

export type PaymentStatus = 'Paid' | 'Unconfirmed';

export interface Attendee {
  id: string;
  name: string;
  organisation: string;
  ticketType: TicketType;
  paymentStatus: PaymentStatus;
  isCheckedIn: boolean;
}

export type FilterOption = 'All' | 'Not arrived' | 'Checked in' | 'Flagged';

export type Screen = 'desk' | 'summary';
