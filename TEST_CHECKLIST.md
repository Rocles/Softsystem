# SoftSystem97 E2E Test Checklist

1. Open `/client` and create a ticket from Open Ticket section.
2. Confirm redirect to `/client/:ticketId?token=...`.
3. Optional: create customer account on `/client` and verify account tickets list is visible there.
4. Client sends a chat message.
5. Admin login `/admin/login`.
6. Admin dashboard shows ticket.
7. Admin opens ticket, takes charge, sets price.
8. Client page shows payable amount.
9. Pay via Stripe test checkout (or mock pay).
10. Verify `payment_status = paid`.
11. Admin assigns ticket to technician.
12. Technician login `/tech/login` and opens assigned ticket.
13. Technician sends message + internal note.
14. Verify client cannot see internal notes.
15. Technician/admin update status through workflow.
16. Ticket can be moved to `closed` and remains in history.

