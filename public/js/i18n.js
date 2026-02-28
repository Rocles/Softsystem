const STORAGE_KEY = "SoftSystem97_lang";

const DICT = {
  en: {
    "nav.softsystem": "SoftSystem97",
    "nav.home": "Home",
    "nav.about": "About",
    "nav.remote_jobs": "Remote Jobs",
    "nav.contact": "Contact",
    "nav.client_space": "Client Space",
    "nav.account": "Account",
    "nav.tickets": "Tickets",
    "nav.payments": "Payments",
    "footer.follow": "Follow us",
    "footer.internal_access": "Internal access",
    "title.home": "SoftSystem97 - IT Support & Helpdesk",
    "title.internal": "Internal Access - SoftSystem97",
    "title.company": "Company Services - SoftSystem97",
    "title.jobs": "Remote Jobs - SoftSystem97",
    "title.client_hub": "Client Space - SoftSystem97",
    "title.client_account": "Client Account - SoftSystem97",
    "title.client_tickets": "Client Tickets - SoftSystem97",
    "title.client_payments": "Client Payments - SoftSystem97",
    "cat.network": "Network",
    "cat.internet_outage": "Internet outage",
    "cat.app": "Application",
    "cat.hardware": "Hardware",
    "cat.other": "Other",
    "prio.low": "Low",
    "prio.medium": "Medium",
    "prio.high": "High",
    "nav.customer": "Support Request",
    "nav.open_ticket": "Open Ticket",
    "nav.careers": "Careers",
    "nav.admin": "Admin",
    "nav.technician": "Technician",
    "nav.logout": "Logout",
    "client.title": "Client Space",
    "client.quick_access": "Quick access for guest clients and account clients.",
    "client.open_ticket": "Open Ticket",
    "client.view_tickets": "View Tickets",
    "client.payments": "Payments",
    "client.account_title": "Customer Account",
    "internal.title": "Internal Team Access",
    "internal.subtitle": "Reserved for SoftSystem97 staff. Choose your workspace to continue.",
    "internal.admin_title": "Admin Console",
    "internal.admin_desc": "Full supervision: tickets, pricing, assignments, technician management, and workflow control.",
    "internal.admin_cta": "Open Admin Login",
    "internal.tech_title": "Technician Workspace",
    "internal.tech_desc": "Assigned tickets only, customer chat, internal work notes, and status updates.",
    "internal.tech_cta": "Open Technician Login",
    "internal.notice": "Security notice: all actions are role-protected and logged.",
    "contract.request_btn": "Organisation Contract",
    "contract.title": "Organisation Contract Request",
    "contract.subtitle": "If your organisation needs a support contract, send your request here.",
    "contract.contact_name": "Contact Name",
    "contract.company_name": "Company Name",
    "contract.team_size": "Team Size",
    "contract.needs": "Needs / Scope",
    "contract.submit": "Send Contract Request",
    "contract.success": "Contract request sent successfully.",
    "contract.confidential": "All contract requests are treated as strictly confidential.",
    "contract.no_sensitive": "Please do not include sensitive information (card numbers, passwords, IDs) in this form.",
    "client.login_title": "Login",
    "client.create_title": "Create Account",
    "common.email": "Email",
    "common.password": "Password",
    "common.full_name": "Full Name",
    "common.login": "Login",
    "common.create_account": "Create Account",
    "common.status": "Status",
    "common.payment": "Payment",
    "common.price": "Price",
    "common.action": "Action",
    "common.actions": "Actions",
    "common.open": "Open",
    "common.all": "All",
    "client.saved_tickets": "Saved Tickets",
    "client.no_saved": "No saved tickets yet. Create a ticket first.",
    "client.no_pending_payments": "No pending payments found.",
    "client.no_accessible_tickets": "No accessible tickets found.",
    "client.no_account_tickets": "No tickets linked to your account yet.",
    "account.quick_actions": "Quick actions",
    "account.open_ticket_now": "Open support ticket",
    "account.view_tickets_now": "View my tickets",
    "account.view_payments_now": "View my payments",
    "admin.login_title": "Admin Login",
    "admin.dashboard_title": "Tickets",
    "admin.search_ph": "Search ticket or email",
    "admin.refresh": "Refresh",
    "admin.all_status": "All status",
    "admin.ticket": "Ticket",
    "admin.client": "Client",
    "admin.company": "Company",
    "admin.description": "Description",
    "admin.tech": "Tech",
    "admin.all_techs": "All technicians",
    "admin.create_tech": "Create Technician",
    "admin.technicians": "Technicians",
    "admin.reset_password": "Reset Password",
    "admin.prompt_new_password": "New password (min 8 chars)",
    "common.yes": "yes",
    "common.no": "no",
    "common.activate": "Activate",
    "common.deactivate": "Deactivate",
    "tech.login_title": "Technician Login",
    "tech.dashboard_title": "Assigned Tickets",
    "tech.back_dashboard": "Back to Dashboard",
    "tech.client_chat": "Client Chat",
    "tech.internal_notes": "Internal Notes",
    "ticket.client_chat": "Client Chat",
    "ticket.internal_notes": "Internal Notes",
    "ticket.history": "History",
    "ticket.take_charge": "Take Charge",
    "ticket.update_status": "Update Status",
    "ticket.assign": "Assign",
    "ticket.send": "Send",
    "ticket.add_note": "Add Note",
    "support.title": "Open Support Ticket",
    "support.contract_hint": "Have a contract account? Login in Customer Space before opening a ticket to link it automatically.",
    "support.access_existing": "Access Existing Ticket",
    "support.ticket_id": "Ticket ID",
    "support.open_existing": "Open Ticket",
    "support.phone_optional": "Phone (optional)",
    "support.company_optional": "Company (optional)",
    "support.category": "Category",
    "support.priority": "Priority",
    "support.description": "Description",
    "support.attachment_optional": "Attachment (optional)",
    "support.create_ticket": "Create Ticket",
    "home.hero_title": "Reliable IT Support for Modern Teams",
    "home.hero_cta1": "Open Support Ticket",
    "home.hero_cta2": "Client Space",
    "admin.back_tickets": "Back to Tickets",
    "admin.col_ticket": "Ticket",
    "admin.col_client": "Client",
    "admin.col_company": "Company",
    "admin.col_email": "Email",
    "admin.col_description": "Description",
    "admin.col_status": "Status",
    "admin.col_payment": "Payment",
    "admin.col_tech": "Tech",
    "admin.col_actions": "Actions",
    "ticket.price_usd": "Price (USD)",
    "ticket.set_price_send": "Set Price & Send Payment Request",
    "ticket.assign_tech": "Assign Tech",
    "common.message": "Message",
    "common.attachment": "Attachment",
    "common.note": "Note",
    "common.logged_in_as": "Connected as",
    "client.payment_page": "Client payment page",
    "client.pay_card": "Pay with Card (Stripe)",
    "client.mock_pay": "Mock Pay",
    "client.download_receipt": "Download Receipt",
    "client.checkout_unavailable": "Checkout unavailable",
    "client.loading_ticket": "Loading ticket...",
    "client.status_prefix": "Status",
    "client.payment_prefix": "Payment",
    "client.price_prefix": "Price",
    "status.new": "New",
    "status.in_progress": "In Progress",
    "status.waiting_client": "Waiting for Customer",
    "status.resolved": "Resolved",
    "status.closed": "Closed",
    "status.pending": "Pending",
    "status.paid": "Paid",
    "ticket.price_invalid": "Enter a valid amount > 0",
    "careers.title": "Join SoftSystem97",
    "careers.subtitle": "Apply for open positions in support, systems and operations.",
    "careers.job_title": "Remote IT Support Technician",
    "careers.job_summary": "Join a structured remote support team trusted by businesses to resolve mission-critical technical incidents.",
    "careers.role_overview_title": "Role Overview",
    "careers.role_overview_text": "This role is designed for technicians who combine technical rigor, ownership mindset, and client communication discipline.",
    "careers.what_you_do_title": "What You Will Do",
    "careers.do_1": "Handle incoming client incidents and triage priorities.",
    "careers.do_2": "Troubleshoot network, desktop, app and connectivity issues remotely.",
    "careers.do_3": "Document interventions clearly in ticket history and internal notes.",
    "careers.do_4": "Communicate status updates to clients in a professional tone.",
    "careers.requirements_title": "Requirements",
    "careers.req_1": "Solid troubleshooting mindset and strong written communication.",
    "careers.req_2": "Experience with Windows, networking basics, and remote tools.",
    "careers.req_3": "Ability to manage multiple tickets while respecting SLA targets.",
    "careers.req_4": "Reliable internet connection and a structured remote workspace.",
    "careers.offer_title": "What We Offer",
    "careers.offer_1": "Remote-first team culture with clear processes.",
    "careers.offer_2": "Career growth path toward senior support and leadership roles.",
    "careers.offer_3": "Performance-based growth opportunities and long-term collaboration.",
    "careers.hiring_process_title": "Hiring Process",
    "careers.step_1": "Submit your application.",
    "careers.step_2": "Short technical screening interview.",
    "careers.step_3": "Practical support scenario review.",
    "careers.step_4": "Final decision and onboarding.",
    "careers.form_title": "Apply for This Position",
    "careers.form_subtitle": "Submit your profile. Our hiring team will contact shortlisted candidates.",
    "careers.no_sensitive": "Do not include sensitive information (card numbers, passwords, government IDs) in your application.",
    "careers.position": "Position",
    "careers.level": "Experience Level",
    "careers.cv": "CV / Resume",
    "careers.cover_letter": "Cover Letter",
    "careers.submit": "Submit Application",
    "careers.success": "Application submitted successfully."
    ,"careers.hero_big_title": "CONNECTING TOP TALENT WITH WORLD CLASS IT SUPPORT TEAMS"
    ,"careers.hero_subtitle": "We recruit disciplined remote technicians and connect them with high-performing support operations."
    ,"careers.point_1": "Premium Support Talent - We identify strong technicians with proven troubleshooting ability."
    ,"careers.point_2": "Structured Workflows - Ticket discipline, communication quality, and clear escalation process."
    ,"careers.point_3": "Reliable Partnership - Built for long-term collaboration between clients and technical teams."
    ,"careers.cta_job_seeker": "I'M A JOB SEEKER"
    ,"careers.cta_company": "WE'RE A COMPANY"
    ,"company.title": "For Companies (MSP / IT Teams)"
    ,"company.subtitle": "Scale your support operation with reliable remote technicians and structured delivery standards."
    ,"company.need_title": "What You Need"
    ,"company.need_1": "Technicians who can handle L1/L2 tickets with consistency."
    ,"company.need_2": "Clear communication with your clients and internal managers."
    ,"company.need_3": "A support culture aligned with SLA and documentation discipline."
    ,"company.offer_title": "What SoftSystem97 Delivers"
    ,"company.offer_1": "Pre-vetted remote support talent."
    ,"company.offer_2": "Structured onboarding into your ticket workflow."
    ,"company.offer_3": "Ongoing quality follow-up and performance alignment."
    ,"company.cta_primary": "Request Company Support"
    ,"company.cta_email": "Contact Recruitment Team"
    ,"home.h1": "Premium IT support for companies and individuals"
    ,"home.p1": "SoftSystem97 supports your teams with responsive service, a clear method and consistent quality."
    ,"home.partner_title": "Your Partner for Professional IT Support"
    ,"home.partner_text": "SoftSystem97 provides specialized IT support services, ensuring smooth operations and fast resolution of technical incidents. We support businesses with clear, reliable and responsive assistance, available 24/7."
    ,"home.point1": "Fast handling - Accurate analysis from the moment the ticket is created."
    ,"home.point2": "Secure payment - Transparent pricing before intervention."
    ,"home.point3": "Qualified experts - Carefully selected profiles to deliver reliable results."
    ,"home.cta_job": "I'M LOOKING FOR A JOB"
    ,"home.cta_company": "WE ARE A COMPANY"
    ,"home.banner_title": "SOFTSYSTEM97 - IT support for companies and individuals"
    ,"home.banner_p1": "SoftSystem97 specializes in IT support and IT talent recruitment. Our mission is simple: help you resolve technical incidents quickly with clear, professional, and reassuring support."
    ,"home.banner_p2": "We mobilize qualified technicians to provide quality assistance, within the best timeframes, with full follow-up until resolution."
    ,"home.stat1_t": "Controlled process"
    ,"home.stat1_p": "Each ticket follows a clear path, from initial analysis to closure."
    ,"home.stat2_t": "Expert team"
    ,"home.stat2_p": "Verified professionals for serious and efficient interventions."
    ,"home.stat3_t": "Transparent communication"
    ,"home.stat3_p": "Continuous follow-up so you always know the status of your request."
    ,"home.services_t": "Discover our IT services"
    ,"home.services_p": "Structured services designed for reliability, speed and continuity."
    ,"home.s1_t": "Installation and configuration"
    ,"home.s1_p": "Setup of workstations, tools and technical parameters aligned with your needs."
    ,"home.s2_t": "Helpdesk support"
    ,"home.s2_p": "Day-to-day assistance for incidents, user requests and fast troubleshooting."
    ,"home.s3_t": "Monitoring and support services"
    ,"home.s3_p": "Proactive system follow-up to prevent interruptions and reduce operational risk."
    ,"home.s4_t": "User training and support"
    ,"home.s4_p": "Practical guidance to improve team autonomy with IT tools and workflows."
    ,"home.s5_t": "System maintenance and updates"
    ,"home.s5_p": "Preventive maintenance, patches and updates to keep your environment stable."
    ,"home.s6_t": "Remote support - Windows and Microsoft Office"
    ,"home.s6_p": "Secure remote intervention to resolve software issues without on-site travel."
    ,"home.process_t": "Our workflow"
    ,"home.p1_t": "Initial review"
    ,"home.p1_p": "We analyze your request and define the intervention scope."
    ,"home.p2_t": "Payment validation"
    ,"home.p2_p": "You receive a secure, clear and verifiable payment link."
    ,"home.p3_t": "Expert assignment"
    ,"home.p3_p": "Your ticket is assigned to the most relevant technician."
    ,"home.p4_t": "Resolution and follow-up"
    ,"home.p4_p": "You are informed at every stage until final resolution."
    ,"home.testimonials_t": "What our clients value"
    ,"home.q1": "\"Since working with SoftSystem97, our incidents are resolved faster and with much more clarity.\""
    ,"home.q1_f": "- Operations Manager, Retail"
    ,"home.q2": "\"Serious team, professional communication, and strong results.\""
    ,"home.q2_f": "- Technical Director, SaaS"
    ,"home.jobs_p": "Looking for a remote IT support opportunity? Join a structured and ambitious team."
    ,"home.jobs_cta": "Apply now"
    ,"home.close_t": "Ready to strengthen your IT support?"
    ,"home.close_p": "Let's discuss your needs and set up reliable, fast and well-organized support."
    ,"home.close_cta1": "Request support"
    ,"home.close_cta2": "Become a business client"
    ,"home.v1": "IT cost optimization"
    ,"home.v2": "Continuous 24/7 support"
    ,"home.v3": "Adaptive and scalable operations"
    ,"home.v4": "Shorter intervention timelines"
    ,"home.v5": "Bilingual and international team"
    ,"home.v6": "Clear service commitments"
    ,"home.v7": "Customer support across channels"
    ,"home.v8": "Modern tools and practices"
    ,"home.v9": "Certified and reliable experts"
    ,"home.v10": "You set direction, we deliver"
    ,"company.h2": "A reliable IT partner for your business"
    ,"company.p1": "SoftSystem97 helps businesses structure IT support, recruit the right profiles and guarantee high-quality technical execution. Our approach combines responsiveness, transparency and accountability."
    ,"company.plan1_t": "What we do"
    ,"company.plan1_i1": "Recruit IT support technicians"
    ,"company.plan1_i2": "Handle incidents and troubleshooting"
    ,"company.plan1_i3": "Client communication through ticketing"
    ,"company.plan1_i4": "Structured escalation and quality control"
    ,"company.plan2_t": "Why companies choose us"
    ,"company.plan2_i1": "Fast onboarding and clear process"
    ,"company.plan2_i2": "Dedicated technicians and rigorous follow-up"
    ,"company.plan2_i3": "Secure payment and documented history"
    ,"company.plan2_i4": "Scalable model for long-term collaboration"
    ,"company.open_btn": "Click here to become a client"
    ,"company.form_t": "Become a client"
    ,"company.f_first": "First name *"
    ,"company.f_last": "Last name *"
    ,"company.f_company": "Company name *"
    ,"company.f_position": "Your role *"
    ,"company.f_website": "Website *"
    ,"company.ph_website": "www.company.com"
    ,"company.f_phone": "Phone"
    ,"company.f_email": "Work email *"
    ,"company.ph_email": "contact@company.com"
    ,"company.f_needs": "Describe your needs *"
    ,"company.f_hear": "How did you hear about us? *"
    ,"company.ph_hear": "Google, referral, social media..."
    ,"company.f_submit": "Send request"
    ,"company.contact_t": "Quick contact"
    ,"company.c1_t": "Support email"
    ,"company.c1_btn": "Send email"
    ,"company.c2_t": "Phone"
    ,"company.c2_btn": "Call now"
    ,"company.c3_p": "Quick exchange for need pre-qualification"
    ,"company.c3_btn": "Chat on WhatsApp"
    ,"company.c4_t": "Service hours"
    ,"company.c4_btn": "Open a ticket"
    ,"company.err_submit": "Failed to submit request"
    ,"company.ok_submit": "Request submitted. Our team will contact you shortly."
    ,"jobs.h2": "Remote IT Support Technician"
    ,"jobs.p1": "Join SoftSystem97 and work on real incidents: network, user workstations, applications and structured client support."
    ,"jobs.form_t": "Apply now"
    ,"jobs.form_p": "Complete this form and upload your CV (PDF, DOC, DOCX, JPG, PNG)."
    ,"jobs.f_name": "Full name *"
    ,"jobs.f_phone": "Phone"
    ,"jobs.f_location": "Location"
    ,"jobs.ph_location": "City, country"
    ,"jobs.f_exp": "Years of experience"
    ,"jobs.ph_exp": "3 years"
    ,"jobs.f_skills": "Main skills"
    ,"jobs.ph_skills": "Network, Windows, M365..."
    ,"jobs.f_msg": "Profile message"
    ,"jobs.ph_msg": "Briefly explain your value proposition."
    ,"jobs.f_cv": "Upload CV *"
    ,"jobs.submit": "Send my application"
    ,"jobs.err_cv": "Please upload your CV."
    ,"jobs.err_submit": "Failed to submit application"
    ,"jobs.ok_submit": "Application submitted successfully. Our team will review your profile."
    ,"clienthub.h2": "Client Space"
    ,"clienthub.p1": "Access your account, tickets and payments in one clear workspace."
    ,"clienthub.card1_t": "Client account"
    ,"clienthub.card1_p": "Create your account, sign in and track your requests easily."
    ,"clienthub.card1_cta": "Go to my account"
    ,"clienthub.card2_t": "Support tickets"
    ,"clienthub.card2_p": "Open a ticket, check its status and chat with our team."
    ,"clienthub.card2_cta": "Manage my tickets"
    ,"clienthub.card3_t": "Payments"
    ,"clienthub.card3_p": "View payment requests and pay your interventions online."
    ,"clienthub.card3_cta": "View my payments"
    ,"account.h2": "Customer Account"
    ,"account.logged_in": "Logged in"
    ,"account.linked_tickets": "Tickets linked to your customer account:"
    ,"payments.h2": "Payment Requests"
    ,"payments.p1": "Only tickets waiting for payment appear here."
    ,"payments.pay_now": "Pay now"
    ,"chat.client": "Client"
    ,"chat.support": "Support"
  },
  fr: {
    "nav.softsystem": "SoftSystem97",
    "nav.home": "Accueil",
    "nav.about": "A propos",
    "nav.remote_jobs": "Emplois a distance",
    "nav.contact": "Contact",
    "nav.client_space": "Espace Client",
    "nav.account": "Compte",
    "nav.tickets": "Tickets",
    "nav.payments": "Paiements",
    "footer.follow": "Suivez-nous",
    "footer.internal_access": "Espace interne",
    "title.home": "SoftSystem97 - Support IT & Helpdesk",
    "title.internal": "Acces interne - SoftSystem97",
    "title.company": "Services Entreprise - SoftSystem97",
    "title.jobs": "Emplois a distance - SoftSystem97",
    "title.client_hub": "Espace Client - SoftSystem97",
    "title.client_account": "Compte Client - SoftSystem97",
    "title.client_tickets": "Tickets Client - SoftSystem97",
    "title.client_payments": "Paiements Client - SoftSystem97",
    "cat.network": "Reseau",
    "cat.internet_outage": "Panne internet",
    "cat.app": "Application",
    "cat.hardware": "Materiel",
    "cat.other": "Autre",
    "prio.low": "Faible",
    "prio.medium": "Moyenne",
    "prio.high": "Elevee",
    "nav.customer": "Demande Support",
    "nav.open_ticket": "Ouvrir Ticket",
    "nav.careers": "Carrieres",
    "nav.admin": "Admin",
    "nav.technician": "Technicien",
    "nav.logout": "Deconnexion",
    "client.title": "Espace Client",
    "client.quick_access": "Acces rapide pour clients invites et clients avec compte.",
    "client.open_ticket": "Ouvrir Ticket",
    "client.view_tickets": "Voir Tickets",
    "client.payments": "Paiements",
    "client.account_title": "Compte Client",
    "internal.title": "Acces equipe interne",
    "internal.subtitle": "Reserve au personnel SoftSystem97. Choisissez votre espace pour continuer.",
    "internal.admin_title": "Console Admin",
    "internal.admin_desc": "Supervision complete: tickets, tarification, affectations, gestion des techniciens et pilotage du workflow.",
    "internal.admin_cta": "Ouvrir la connexion Admin",
    "internal.tech_title": "Espace Technicien",
    "internal.tech_desc": "Tickets assignes uniquement, chat client, notes de travail internes et mise a jour des statuts.",
    "internal.tech_cta": "Ouvrir la connexion Technicien",
    "internal.notice": "Securite: toutes les actions sont protegees par role et journalisees.",
    "contract.request_btn": "Demande Contrat",
    "contract.title": "Demande de Contrat Organisation",
    "contract.subtitle": "Si votre organisation a besoin d'un contrat support, envoyez votre demande ici.",
    "contract.contact_name": "Nom du Contact",
    "contract.company_name": "Nom de l'Entreprise",
    "contract.team_size": "Taille de l'Equipe",
    "contract.needs": "Besoins / Perimetre",
    "contract.submit": "Envoyer Demande Contrat",
    "contract.success": "Demande de contrat envoyee avec succes.",
    "contract.confidential": "Toutes les demandes de contrat sont traitees de facon strictement confidentielle.",
    "contract.no_sensitive": "Merci de ne pas inclure d'informations sensibles (cartes, mots de passe, identifiants) dans ce formulaire.",
    "client.login_title": "Connexion",
    "client.create_title": "Creer un Compte",
    "common.email": "Email",
    "common.password": "Mot de passe",
    "common.full_name": "Nom Complet",
    "common.login": "Connexion",
    "common.create_account": "Creer un Compte",
    "common.status": "Statut",
    "common.payment": "Paiement",
    "common.price": "Prix",
    "common.action": "Action",
    "common.actions": "Actions",
    "common.open": "Ouvrir",
    "common.all": "Tous",
    "client.saved_tickets": "Tickets Enregistres",
    "client.no_saved": "Aucun ticket enregistre pour le moment. Creez un ticket d'abord.",
    "client.no_pending_payments": "Aucun paiement en attente.",
    "client.no_accessible_tickets": "Aucun ticket accessible trouve.",
    "client.no_account_tickets": "Aucun ticket lie a votre compte pour le moment.",
    "account.quick_actions": "Actions rapides",
    "account.open_ticket_now": "Ouvrir un ticket support",
    "account.view_tickets_now": "Voir mes tickets",
    "account.view_payments_now": "Voir mes paiements",
    "admin.login_title": "Connexion Admin",
    "admin.dashboard_title": "Tickets",
    "admin.search_ph": "Rechercher ticket ou email",
    "admin.refresh": "Actualiser",
    "admin.all_status": "Tous les statuts",
    "admin.ticket": "Ticket",
    "admin.client": "Client",
    "admin.company": "Entreprise",
    "admin.description": "Description",
    "admin.tech": "Technicien",
    "admin.all_techs": "Tous les techniciens",
    "admin.create_tech": "Creer Technicien",
    "admin.technicians": "Techniciens",
    "admin.reset_password": "Reinitialiser Mot de passe",
    "admin.prompt_new_password": "Nouveau mot de passe (min 8 caracteres)",
    "common.yes": "oui",
    "common.no": "non",
    "common.activate": "Activer",
    "common.deactivate": "Desactiver",
    "tech.login_title": "Connexion Technicien",
    "tech.dashboard_title": "Tickets Assignes",
    "tech.back_dashboard": "Retour Dashboard",
    "tech.client_chat": "Chat Client",
    "tech.internal_notes": "Notes Internes",
    "ticket.client_chat": "Chat Client",
    "ticket.internal_notes": "Notes Internes",
    "ticket.history": "Historique",
    "ticket.take_charge": "Prendre en Charge",
    "ticket.update_status": "Mettre a Jour",
    "ticket.assign": "Assigner",
    "ticket.send": "Envoyer",
    "ticket.add_note": "Ajouter Note",
    "support.title": "Ouvrir un Ticket Support",
    "support.contract_hint": "Vous avez un compte contrat ? Connectez-vous dans l'espace client avant d'ouvrir un ticket pour le lier automatiquement.",
    "support.access_existing": "Acceder a un Ticket Existant",
    "support.ticket_id": "ID Ticket",
    "support.open_existing": "Ouvrir Ticket",
    "support.phone_optional": "Telephone (optionnel)",
    "support.company_optional": "Entreprise (optionnel)",
    "support.category": "Categorie",
    "support.priority": "Priorite",
    "support.description": "Description",
    "support.attachment_optional": "Piece jointe (optionnel)",
    "support.create_ticket": "Creer Ticket",
    "home.hero_title": "Support IT fiable pour les equipes modernes",
    "home.hero_cta1": "Ouvrir un Ticket",
    "home.hero_cta2": "Espace Client",
    "admin.back_tickets": "Retour Tickets",
    "admin.col_ticket": "Ticket",
    "admin.col_client": "Client",
    "admin.col_company": "Entreprise",
    "admin.col_email": "Email",
    "admin.col_description": "Description",
    "admin.col_status": "Statut",
    "admin.col_payment": "Paiement",
    "admin.col_tech": "Technicien",
    "admin.col_actions": "Actions",
    "ticket.price_usd": "Prix (USD)",
    "ticket.set_price_send": "Definir Prix et Envoyer Paiement",
    "ticket.assign_tech": "Assigner Technicien",
    "common.message": "Message",
    "common.attachment": "Piece jointe",
    "common.note": "Note",
    "common.logged_in_as": "Connecte en tant que",
    "client.payment_page": "Page de paiement client",
    "client.pay_card": "Payer par Carte (Stripe)",
    "client.mock_pay": "Paiement Test",
    "client.download_receipt": "Telecharger Recu",
    "client.checkout_unavailable": "Paiement indisponible",
    "client.loading_ticket": "Chargement du ticket...",
    "client.status_prefix": "Statut",
    "client.payment_prefix": "Paiement",
    "client.price_prefix": "Prix",
    "status.new": "Nouveau",
    "status.in_progress": "En cours",
    "status.waiting_client": "En attente client",
    "status.resolved": "Resolue",
    "status.closed": "Ferme",
    "status.pending": "En attente",
    "status.paid": "Paye",
    "ticket.price_invalid": "Entrez un montant valide > 0",
    "careers.title": "Rejoignez SoftSystem97",
    "careers.subtitle": "Postulez aux postes ouverts en support, systemes et operations.",
    "careers.job_title": "Technicien Support IT a Distance",
    "careers.job_summary": "Rejoignez une equipe de support remote structuree, au service d'entreprises qui gerent des incidents techniques critiques.",
    "careers.role_overview_title": "Apercu du Poste",
    "careers.role_overview_text": "Ce poste convient aux techniciens qui allient rigueur technique, sens des responsabilites et communication client professionnelle.",
    "careers.what_you_do_title": "Vos Missions",
    "careers.do_1": "Prendre en charge les incidents clients et prioriser les urgences.",
    "careers.do_2": "Diagnostiquer a distance les problemes reseau, poste, application et connectivite.",
    "careers.do_3": "Documenter clairement les interventions dans l'historique ticket et les notes internes.",
    "careers.do_4": "Communiquer les mises a jour de statut aux clients de facon professionnelle.",
    "careers.requirements_title": "Exigences",
    "careers.req_1": "Esprit d'analyse solide et excellente communication ecrite.",
    "careers.req_2": "Experience avec Windows, notions reseau et outils de prise en main a distance.",
    "careers.req_3": "Capacite a gerer plusieurs tickets en respectant les objectifs SLA.",
    "careers.req_4": "Connexion internet fiable et environnement de travail remote structure.",
    "careers.offer_title": "Ce Que Nous Offrons",
    "careers.offer_1": "Culture remote-first avec processus clairs.",
    "careers.offer_2": "Parcours d'evolution vers des roles senior support et leadership.",
    "careers.offer_3": "Opportunites d'evolution basees sur la performance et collaboration long terme.",
    "careers.hiring_process_title": "Processus de Recrutement",
    "careers.step_1": "Soumettez votre candidature.",
    "careers.step_2": "Court entretien de preselection technique.",
    "careers.step_3": "Evaluation pratique sur un scenario support.",
    "careers.step_4": "Decision finale et onboarding.",
    "careers.form_title": "Postuler a Ce Poste",
    "careers.form_subtitle": "Envoyez votre profil. Notre equipe recrutement contactera les profils retenus.",
    "careers.no_sensitive": "N'incluez pas d'informations sensibles (cartes, mots de passe, identifiants officiels) dans votre candidature.",
    "careers.position": "Poste",
    "careers.level": "Niveau d'experience",
    "careers.cv": "CV / Resume",
    "careers.cover_letter": "Lettre de motivation",
    "careers.submit": "Envoyer Candidature",
    "careers.success": "Candidature envoyee avec succes."
    ,"careers.hero_big_title": "NOUS CONNECTONS LES MEILLEURS TALENTS AUX EQUIPES IT D'EXCELLENCE"
    ,"careers.hero_subtitle": "Nous recrutons des techniciens remote disciplines et les connectons a des operations support performantes."
    ,"careers.point_1": "Talents Support Premium - Nous identifions des techniciens solides avec une vraie capacite de diagnostic."
    ,"careers.point_2": "Workflows Structures - Discipline ticket, qualite de communication et escalation claire."
    ,"careers.point_3": "Partenariat Fiable - Concu pour une collaboration long terme entre clients et equipes techniques."
    ,"careers.cta_job_seeker": "JE CHERCHE UN POSTE"
    ,"careers.cta_company": "NOUS SOMMES UNE ENTREPRISE"
    ,"company.title": "Pour les Entreprises (MSP / Equipes IT)"
    ,"company.subtitle": "Faites evoluer votre operation support avec des techniciens remote fiables et des standards de livraison structures."
    ,"company.need_title": "Vos Besoins"
    ,"company.need_1": "Des techniciens capables de traiter les tickets L1/L2 avec constance."
    ,"company.need_2": "Une communication claire avec vos clients et vos responsables internes."
    ,"company.need_3": "Une culture support alignee sur les SLA et la discipline documentaire."
    ,"company.offer_title": "Ce Que SoftSystem97 Fournit"
    ,"company.offer_1": "Des talents support remote pre-qualifies."
    ,"company.offer_2": "Un onboarding structure dans votre workflow ticket."
    ,"company.offer_3": "Un suivi qualite continu et un alignement performance."
    ,"company.cta_primary": "Demander un Support Entreprise"
    ,"company.cta_email": "Contacter l'Equipe Recrutement"
    ,"home.h1": "Support informatique premium pour les entreprises et les particuliers"
    ,"home.p1": "SoftSystem97 accompagne vos equipes avec un support réactif, une méthode claire et une qualité de service constante."
    ,"home.partner_title": "Votre Partenaire en Support IT Professionnel"
    ,"home.partner_text": "SoftSystem97 fournit des services de support IT specialises, garantissant des operations fluides et la resolution rapide des incidents techniques. Nous accompagnons les entreprises avec une assistance claire, fiable et reactive, disponible 24h/24 et 7j/7."
    ,"home.point1": "Prise en charge rapide - Une analyse précise dès la création du ticket."
    ,"home.point2": "Paiement sécurisé - Une tarification transparente avant toute intervention."
    ,"home.point3": "Experts qualifiés - Des profils sélectionnés pour garantir des résultats fiables."
    ,"home.cta_job": "JE SUIS A LA RECHERCHE D'UN EMPLOI"
    ,"home.cta_company": "NOUS SOMMES UNE ENTREPRISE"
    ,"home.banner_title": "SOFTSYSTEM97 - Support informatique pour entreprises et particuliers"
    ,"home.banner_p1": "SoftSystem97 est spécialisée dans le support informatique et le recrutement de talents IT. Notre mission est simple : vous aider à résoudre rapidement vos incidents techniques avec un accompagnement clair, professionnel et rassurant."
    ,"home.banner_p2": "Nous mobilisons des techniciens qualifiés pour offrir une assistance de qualité, dans les meilleurs délais, avec un suivi complet jusqu'à la résolution."
    ,"home.stat1_t": "Processus maîtrisé"
    ,"home.stat1_p": "Chaque ticket suit un parcours clair, de l'analyse initiale à la clôture."
    ,"home.stat2_t": "Équipe experte"
    ,"home.stat2_p": "Des professionnels vérifiés pour des interventions rigoureuses et efficaces."
    ,"home.stat3_t": "Communication transparente"
    ,"home.stat3_p": "Un suivi continu pour que vous sachiez toujours où en est votre demande."
    ,"home.services_t": "Decouvrez tous nos services IT"
    ,"home.services_p": "Des services structures pour garantir fiabilite, rapidite et continuite."
    ,"home.s1_t": "Installation et configuration"
    ,"home.s1_p": "Mise en place des postes, outils et parametres techniques selon vos besoins."
    ,"home.s2_t": "Support helpdesk"
    ,"home.s2_p": "Assistance quotidienne pour incidents, demandes utilisateurs et depannage rapide."
    ,"home.s3_t": "Service de surveillance et support"
    ,"home.s3_p": "Suivi proactif des systemes pour prevenir les interruptions et reduire les risques."
    ,"home.s4_t": "Formation et support utilisateur"
    ,"home.s4_p": "Accompagnement des equipes pour renforcer leur autonomie sur les outils IT."
    ,"home.s5_t": "Maintenance et mises a jour de systeme"
    ,"home.s5_p": "Maintenance preventive, correctifs et mises a jour pour un environnement stable."
    ,"home.s6_t": "Support a distance - Windows et Microsoft Office"
    ,"home.s6_p": "Intervention remote securisee pour resoudre vos problemes logiciels sans deplacement."
    ,"home.process_t": "Notre méthode de travail"
    ,"home.p1_t": "Prise en compte"
    ,"home.p1_p": "Nous analysons votre demande et définissons le cadre d'intervention."
    ,"home.p2_t": "Validation du paiement"
    ,"home.p2_p": "Vous recevez un lien de paiement sécurisé, clair et vérifiable."
    ,"home.p3_t": "Affectation d'un expert"
    ,"home.p3_p": "Le ticket est confié au technicien le plus adapté à votre besoin."
    ,"home.p4_t": "Résolution et suivi"
    ,"home.p4_p": "Vous êtes informé à chaque étape, jusqu'à la résolution finale."
    ,"home.testimonials_t": "Ce que nos clients apprécient"
    ,"home.q1": "\"Depuis que nous travaillons avec SoftSystem97, nos incidents sont traités plus vite et avec beaucoup plus de clarté.\""
    ,"home.q1_f": "- Responsable Operations, Retail"
    ,"home.q2": "\"Une équipe sérieuse, une communication professionnelle et des résultats au rendez-vous.\""
    ,"home.q2_f": "- Directeur Technique, SaaS"
    ,"home.jobs_p": "Vous cherchez une opportunité en support IT à distance ? Rejoignez une équipe structurée et ambitieuse."
    ,"home.jobs_cta": "Postuler maintenant"
    ,"home.close_t": "Prêt à renforcer votre support informatique ?"
    ,"home.close_p": "Parlons de vos besoins et mettons en place un support fiable, rapide et parfaitement organisé."
    ,"home.close_cta1": "Demander un support"
    ,"home.close_cta2": "Devenir client entreprise"
    ,"home.v1": "Optimisation des couts informatiques"
    ,"home.v2": "Assistance continue 24/7"
    ,"home.v3": "Organisation flexible et evolutive"
    ,"home.v4": "Delais d intervention reduits"
    ,"home.v5": "Equipe bilingue et internationale"
    ,"home.v6": "Engagements de service clairement definis"
    ,"home.v7": "Assistance client sur plusieurs canaux"
    ,"home.v8": "Outils et methodes a jour"
    ,"home.v9": "Experts qualifies et fiables"
    ,"home.v10": "Vous fixez les objectifs, nous assurons l execution"
    ,"company.h2": "Un partenaire IT fiable pour votre entreprise"
    ,"company.p1": "SoftSystem97 aide les entreprises à structurer leur support IT, à recruter les bons profils et à garantir une exécution technique de qualité. Notre approche combine réactivité, transparence et responsabilité sur chaque intervention."
    ,"company.plan1_t": "Ce que nous faisons"
    ,"company.plan1_i1": "Recrutement de techniciens support IT"
    ,"company.plan1_i2": "Prise en charge des incidents et dépannage"
    ,"company.plan1_i3": "Communication client via ticketing"
    ,"company.plan1_i4": "Escalade structurée et contrôle qualité"
    ,"company.plan2_t": "Pourquoi les entreprises nous choisissent"
    ,"company.plan2_i1": "Onboarding rapide et processus clair"
    ,"company.plan2_i2": "Techniciens dédiés et suivi rigoureux"
    ,"company.plan2_i3": "Paiement sécurisé et historique documenté"
    ,"company.plan2_i4": "Modèle évolutif pour une collaboration à long terme"
    ,"company.open_btn": "Cliquez ici pour devenir client"
    ,"company.form_t": "Devenir client"
    ,"company.f_first": "Prénom *"
    ,"company.f_last": "Nom *"
    ,"company.f_company": "Nom de l’entreprise *"
    ,"company.f_position": "Votre fonction *"
    ,"company.f_website": "Site Web *"
    ,"company.ph_website": "www.entreprise.com"
    ,"company.f_phone": "Téléphone"
    ,"company.f_email": "E-mail professionnel *"
    ,"company.ph_email": "contact@entreprise.com"
    ,"company.f_needs": "Description de vos besoins *"
    ,"company.f_hear": "Comment avez-vous entendu parler de nous ? *"
    ,"company.ph_hear": "Google, recommandation, reseaux sociaux..."
    ,"company.f_submit": "Envoyer la demande"
    ,"company.contact_t": "Contact rapide"
    ,"company.c1_t": "E-mail support"
    ,"company.c1_btn": "Envoyer un email"
    ,"company.c2_t": "Téléphone"
    ,"company.c2_btn": "Appeler maintenant"
    ,"company.c3_p": "Échange rapide pour la pré-qualification de votre besoin"
    ,"company.c3_btn": "Écrire sur WhatsApp"
    ,"company.c4_t": "Horaires de service"
    ,"company.c4_btn": "Ouvrir un ticket"
    ,"company.err_submit": "Échec lors de l'envoi de la demande"
    ,"company.ok_submit": "Demande envoyée. Notre équipe vous contactera rapidement."
    ,"jobs.h2": "Technicien support IT à distance"
    ,"jobs.p1": "Rejoignez SoftSystem97 et travaillez sur des incidents réels : réseau, postes utilisateurs, applications et support client structuré."
    ,"jobs.form_t": "Postuler maintenant"
    ,"jobs.form_p": "Remplissez ce formulaire et joignez votre CV (PDF, DOC, DOCX, JPG, PNG)."
    ,"jobs.f_name": "Nom complet *"
    ,"jobs.f_phone": "Téléphone"
    ,"jobs.f_location": "Localisation"
    ,"jobs.ph_location": "Ville, pays"
    ,"jobs.f_exp": "Années d'expérience"
    ,"jobs.ph_exp": "3 ans"
    ,"jobs.f_skills": "Compétences principales"
    ,"jobs.ph_skills": "Réseau, Windows, M365..."
    ,"jobs.f_msg": "Message de présentation"
    ,"jobs.ph_msg": "Expliquez en quelques lignes votre valeur ajoutée."
    ,"jobs.f_cv": "Joindre le CV *"
    ,"jobs.submit": "Envoyer ma candidature"
    ,"jobs.err_cv": "Merci de joindre votre CV."
    ,"jobs.err_submit": "Échec de l'envoi de la candidature"
    ,"jobs.ok_submit": "Candidature envoyée avec succès. Notre équipe analysera votre profil."
    ,"clienthub.h2": "Espace Client"
    ,"clienthub.p1": "Retrouvez dans un seul espace la gestion de votre compte, de vos tickets et de vos paiements."
    ,"clienthub.card1_t": "Compte client"
    ,"clienthub.card1_p": "Créez votre compte, connectez-vous et suivez vos demandes en toute simplicité."
    ,"clienthub.card1_cta": "Aller a mon compte"
    ,"clienthub.card2_t": "Tickets de support"
    ,"clienthub.card2_p": "Ouvrez un ticket, consultez son statut et échangez avec notre équipe."
    ,"clienthub.card2_cta": "Gerer mes tickets"
    ,"clienthub.card3_t": "Paiements"
    ,"clienthub.card3_p": "Consultez vos demandes de paiement et réglez vos interventions en ligne."
    ,"clienthub.card3_cta": "Voir mes paiements"
    ,"account.h2": "Compte client"
    ,"account.logged_in": "Connecté"
    ,"account.linked_tickets": "Tickets liés à votre compte client :"
    ,"payments.h2": "Demandes de paiement"
    ,"payments.p1": "Seuls les tickets en attente de paiement apparaissent ici."
    ,"payments.pay_now": "Payer maintenant"
    ,"chat.client": "Client"
    ,"chat.support": "Support"
  }
};

export const getLang = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "fr" ? "fr" : "en";
};

export const t = (key) => {
  const lang = getLang();
  return DICT[lang]?.[key] || DICT.en[key] || key;
};

export const tStatus = (status) => {
  const key = `status.${String(status || "").toLowerCase()}`;
  const translated = t(key);
  return translated === key ? String(status || "") : translated;
};

export const applyTranslations = () => {
  const lang = getLang();
  document.documentElement.lang = lang;
  for (const el of document.querySelectorAll("[data-i18n]")) {
    el.textContent = t(el.dataset.i18n);
  }
  for (const el of document.querySelectorAll("[data-i18n-placeholder]")) {
    el.setAttribute("placeholder", t(el.dataset.i18nPlaceholder));
  }
};

const emitChange = () => window.dispatchEvent(new CustomEvent("SoftSystem97:langchange", { detail: { lang: getLang() } }));

const setLang = (lang) => {
  localStorage.setItem(STORAGE_KEY, lang === "fr" ? "fr" : "en");
  applyTranslations();
  emitChange();
};

const injectSwitcher = () => {
  if (document.getElementById("langSwitcher")) return;
  const wrap = document.createElement("div");
  wrap.id = "langSwitcher";
  wrap.style.display = "flex";
  wrap.style.gap = "8px";
  wrap.style.alignItems = "center";
  wrap.style.marginLeft = "auto";
  const label = document.createElement("span");
  label.textContent = "Lang";
  const select = document.createElement("select");
  select.innerHTML = "<option value='en'>EN</option><option value='fr'>FR</option>";
  select.value = getLang();
  select.onchange = () => setLang(select.value);
  wrap.append(label, select);

  const header = document.querySelector("header");
  if (header) {
    header.appendChild(wrap);
    return;
  }
  wrap.style.position = "fixed";
  wrap.style.top = "10px";
  wrap.style.right = "10px";
  wrap.style.background = "#ffffff";
  wrap.style.padding = "6px 10px";
  wrap.style.border = "1px solid #cfd8e6";
  wrap.style.borderRadius = "8px";
  document.body.appendChild(wrap);
};

export const initI18n = () => {
  injectSwitcher();
  applyTranslations();
};

export const onLangChange = (cb) => {
  window.addEventListener("SoftSystem97:langchange", cb);
};


