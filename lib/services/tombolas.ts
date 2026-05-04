import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Tombola, UUID } from '@/types';

export type TombolaSummary = Pick<
  Tombola,
  | 'id'
  | 'title'
  | 'prize'
  | 'prize_image_url'
  | 'ticket_price_cents'
  | 'max_participants'
  | 'draw_date'
  | 'status'
>;

export type TombolaStats = {
  totalParticipants: number;
  totalTickets: number;
};

type TombolaStatsRow = {
  total_participants: number;
  total_tickets: number;
};

export async function getActiveTombola(): Promise<TombolaSummary | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('tombolas')
    .select(
      'id, title, prize, prize_image_url, ticket_price_cents, max_participants, draw_date, status',
    )
    .eq('type', 'main')
    .eq('status', 'active')
    .maybeSingle()
    .overrideTypes<TombolaSummary, { merge: false }>();

  if (error) throw error;
  return data;
}

export async function getActiveTombolaStats(tombolaId: UUID): Promise<TombolaStats> {
  const supabase = await createSupabaseServerClient();

  // Aggregates only — uses a SECURITY DEFINER RPC so anon visitors never
  // SELECT directly on participations (which holds user_id / payment_id).
  const { data, error } = await supabase
    .rpc('get_tombola_stats', { p_tombola_id: tombolaId })
    .single()
    .overrideTypes<TombolaStatsRow, { merge: false }>();

  if (error) throw error;
  if (!data) return { totalParticipants: 0, totalTickets: 0 };

  return {
    totalParticipants: data.total_participants,
    totalTickets: data.total_tickets,
  };
}
