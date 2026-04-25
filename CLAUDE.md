@AGENTS.md

# Raffle App

## Concept
Application de tombola mensuelle. Une tombola active à la fois (V1).
Lots : objets gaming/tech (ex: Nintendo Switch 2).
Cadence : tirage principal mensuel + tirage secondaire mid-month (petit lot).
Cible : grand public, communauté gamer/Discord.

## Objectifs
- Projet portfolio propre, mais pensé comme une vraie base produit.
- Landing page moderne avec countdown avant tirage.
- Affichage du nombre de participants.
- Authentification utilisateur.
- Achat de billet via Stripe d'abord.
- PayPal sera ajouté rapidement ensuite, donc prévoir une couche d'abstraction paiement.
- Dashboard utilisateur pour voir ses participations.
- Dashboard admin pour voir les participants et lancer un tirage.
- La logique sensible doit rester côté serveur.

## Règles métier
- Prix du billet : fixe (ex: 5€)
- Limite de participants par tombola (ex: 500 ou 1000 max)
- Tirage automatique à la date, mais avec validation manuelle admin avant annonce
- Un user peut acheter plusieurs billets (à définir : max par user ?)
- Paiement confirmé côté serveur AVANT inscription en DB (jamais côté client)

## Stack
- Next.js 15 App Router, TypeScript, Tailwind
- Supabase (DB + Auth)
- Stripe + PayPal via couche d'abstraction /lib/payments.ts
- Framer Motion (animations)

## Architecture paiements
Ne jamais appeler Stripe ou PayPal directement dans les composants.
Toujours passer par /lib/payments.ts qui expose :
- createCheckoutSession(provider, data)
- verifyPayment(provider, paymentId)
Cela permet d'ajouter des providers sans toucher au reste de l'app.

## Contraintes techniques
- Ne jamais appeler Stripe, PayPal ou Supabase directement dans les composants
- Couches obligatoires : /lib/services, /lib/payments, /lib/supabase
- Paiements validés uniquement côté serveur via webhook
- La participation ne doit JAMAIS être créée depuis la page /success

## Structure DB
- users (géré par Supabase Auth)
- tombolas (id, titre, description, lot, date_tirage, prix_billet, max_participants, type: 'main'|'secondary', statut: 'active'|'closed'|'drawn')
- participations (id, user_id, tombola_id, nb_billets, payment_provider, payment_id, created_at)
- tirages (id, tombola_id, winner_user_id, drawn_at, validated_by_admin, announced_at)

## Design
- SPA, dark mode par défaut, toggle light/dark
- Ambiance : sérieux mais moderne, animations fluides (pas flashy)
- Landing : countdown animé, tickets restants en temps réel, CTA participer
- Séparateur diagonal entre header et contenu
- Scroll : explication du fonctionnement, stats (cagnottes passées, gagnants)
- Footer : mentions légales, SIRET, CGU
- Commentaires / témoignages gagnants (V2)

## Conventions
- Server Components par défaut, 'use client' uniquement si interaction
- Actions serveur dans /app/actions/
- Types dans /types/index.ts
- Variables d'env dans .env.local, jamais hardcodées
- IMPORTANT: valider paiement côté serveur avant toute inscription

## Commandes
- npm run dev
- npm run build
- npm run lint