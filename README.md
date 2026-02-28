# SoftSystem97 - IT Support Platform

SoftSystem97 is a production-oriented IT support web application built with Node.js + Express + SQLite + HTML/CSS/Vanilla JS.

## Features

- Bilingual interface (English / French) with language switcher on all main pages.

### Client side
- Landing page on `/`
- Dedicated support request space on `/client` with:
  - `Open Ticket`
  - `View Tickets`
  - `Payments`
  - `Organisation Contract Request`
- Optional customer account:
  - Signup/Login directly inside `/client`
  - Account holders can see all their own tickets in one place
- Fields: full name, email, phone (optional), company (optional), category, priority, description, attachment
- Server-side validation
- Unique ticket id format: `SS-YYYY-XXXXX`
- Secure client access with `ticketId + email` or direct access token URL
- Ticket page `/client/:ticketId`
- Client/support chat inside ticket (saved)
- Status visibility
- Payment flow (Stripe card checkout or mock payment)
- Receipt download (PDF)

### Admin side
- Login: `/admin/login`
- Dashboard: `/admin`
- Filters: status + search by ticket or email
- Ticket helper page: `/admin/tickets/:ticketId`
- Take charge, set price, assign technician, update status
- Public messages to client
- Internal private notes
- Action history log
- Technician management: `/admin/techs`
  - create/edit/activate/deactivate/reset password

### Technician side
- Login: `/tech/login`
- Dashboard: `/tech`
- Only assigned tickets visible
- Ticket page: `/tech/tickets/:ticketId`
- Chat with client
- Internal private notes
- Update status

## Tech stack
- Backend: Node.js + Express
- Storage: SQLite (`better-sqlite3`)
- Auth: session-based (`express-session` + `bcryptjs`)
- File upload: `multer`
- Email: `nodemailer`
- Payments: Stripe Checkout + webhook
- Frontend: HTML + CSS + Vanilla JS

## Project structure

```text
SoftSystem97/
  db/
    schema.sql
  public/
    css/styles.css
    js/*.js
    index.html
    client.html
    admin*.html
    tech*.html
  receipts/
  uploads/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    app.js
    server.js
  .env.example
  package.json
```

## Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Important variables:
- `PORT`
- `APP_BASE_URL`
- `SESSION_SECRET`
- `DB_PATH`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `MOCK_PAYMENTS`
- `SMTP_*` for ticket confirmation emails
- `SUPPORT_INBOX_EMAIL` to receive every new client ticket notification

If `SMTP_HOST` is not configured, tickets still work but email confirmation is skipped and logged as `[mail disabled]`.

## Run locally

```bash
cd softsystem
npm install
npm start
```

Health check:
- `GET http://localhost:4000/api/health`

Default seeded accounts:
- Admin: `admin@softsystem.local` / `Admin123!`
- Tech: `tech@softsystem.local` / `Tech123!`

## Stripe test mode

1. Set in `.env`:
   - `STRIPE_SECRET_KEY=sk_test_...`
   - `STRIPE_WEBHOOK_SECRET=whsec_...`
   - `MOCK_PAYMENTS=false`
2. Run app.
3. Forward webhook:

```bash
stripe listen --forward-to localhost:4000/api/payments/stripe/webhook
```

4. Create ticket -> admin sets price -> client pays via card.

Recommended test cards:
- Visa: `4242 4242 4242 4242`
- Mastercard: `5555 5555 5555 4444`
- Amex: `3782 822463 10005`
- 3DS challenge: `4000 0027 6000 3184`

## Switch to live mode

1. Replace Stripe test keys with live keys:
   - `STRIPE_SECRET_KEY=sk_live_...`
   - `STRIPE_WEBHOOK_SECRET=whsec_live_...`
2. Set production `APP_BASE_URL`.
3. Register production webhook URL in Stripe dashboard.
4. Set `NODE_ENV=production`.
5. Restart app.

## Hostinger deployment (VPS)

1. Create VPS + domain + SSL.
2. Install Node.js 20+.
3. Copy project to server.
4. Create `.env` with production values.
5. Install dependencies:

```bash
npm install
```

6. Run with PM2:

```bash
npm install -g pm2
pm2 start src/server.js --name softsystem --cwd /path/to/softsystem
pm2 save
```

7. Configure Nginx reverse proxy to app port (default 4000).
8. Configure Stripe webhook endpoint:
- `https://yourdomain.com/api/payments/stripe/webhook`

## End-to-end checklist

1. Create ticket from `/client` (Open Ticket section)
2. Access client ticket page (`/client/:ticketId`)
3. (Optional) create customer account in `/client` and open ticket while logged in
4. Admin login and take charge
5. Admin set price and send payment request
6. Client pays (Stripe test or mock)
7. Payment status becomes `paid`
8. Admin assigns technician
9. Technician sees assigned ticket
10. Client/support exchange messages
11. Tech/admin add internal notes (not visible to client)
12. Update status flow to resolved/closed

## SaaS evolution readiness

Architecture is separated by controllers/models/services and supports extension for:
- subscriptions
- client accounts
- SLA rules
- invoices/KPI dashboards
- multi-company tenancy
- advanced roles/permissions


