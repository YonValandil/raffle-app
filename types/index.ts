export type UUID = string;
export type ISODateString = string;

export type UserRole = 'user' | 'admin';
export type TombolaType = 'main' | 'secondary';
export type TombolaStatus = 'active' | 'closed' | 'drawn';
export type PaymentProvider = 'stripe' | 'paypal';
export type PaymentStatus = 'paid' | 'refunded' | 'pending' | 'failed';

export type PaymentMetadata = {
  tombolaId: UUID;
  userId: UUID;
  nbTickets: number;
};

export type Profile = {
  id: UUID;
  email: string;
  display_name: string | null;
  role: UserRole;
  created_at: ISODateString;
};

export type Tombola = {
  id: UUID;
  title: string;
  description: string | null;
  prize: string;
  prize_image_url: string | null;
  ticket_price_cents: number;
  max_participants: number;
  max_tickets_per_user: number;
  type: TombolaType;
  status: TombolaStatus;
  draw_date: ISODateString;
  created_at: ISODateString;
};

export type Participation = {
  id: UUID;
  user_id: UUID;
  tombola_id: UUID;
  nb_tickets: number;
  amount_cents: number;
  payment_provider: PaymentProvider;
  payment_id: string;
  payment_status: PaymentStatus;
  created_at: ISODateString;
};

export type Tirage = {
  id: UUID;
  tombola_id: UUID;
  winner_user_id: UUID;
  winner_participation_id: UUID;
  drawn_at: ISODateString;
  validated_by_admin: boolean;
  announced_at: ISODateString | null;
};

export type CheckoutSessionInput = {
  tombolaId: UUID;
  userId: UUID;
  nbTickets: number;
  unitAmountCents: number;
  successUrl: string;
  cancelUrl: string;
};

export type CheckoutSessionResult = {
  provider: PaymentProvider;
  paymentId: string;
  redirectUrl: string;
};

export type VerifiedPayment = {
  provider: PaymentProvider;
  paymentId: string;
  status: PaymentStatus;
  amountCents: number;
  metadata: PaymentMetadata;
};
