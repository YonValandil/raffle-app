@AGENTS.md

# Tombola App

## Stack
- Next.js 15 App Router, TypeScript, Tailwind
- Supabase (DB + Auth)
- Stripe + PayPal (paiements)
- Framer Motion (animations compteur)

## Structure DB
- users (géré par Supabase Auth)
- tombolas (id, titre, date_tirage, prix_billet, max_participants)
- participations (id, user_id, tombola_id, stripe_payment_id, created_at)

## Conventions
- Server Components par défaut, Client Component uniquement si interaction
- Actions serveur dans /app/actions/
- Types dans /types/index.ts
- IMPORTANT: toujours valider les paiements côté serveur avant d'inscrire un participant
- Ne jamais exposer les clés Stripe/Supabase côté client

## Commandes
- npm run dev
- npm run build
- npm run lint