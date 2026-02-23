# PROMPT DI HANDOFF PROFESSIONALE — CHECKS ENERGY

Sto proseguendo un progetto già avviato per **Checks Energy**. Questa chat è il seguito di un lavoro precedente e voglio ripartire in modo ordinato senza perdere il contesto.

## Obiettivo generale
1. Landing page commerciale (quasi finalizzata)
2. Portale agenzia (mock UI già progettato)
3. Backend API + PostgreSQL per collegare il portale ai dati reali
4. Deploy:
   - Frontend statico su Register.it (cartella `/portale`)
   - Backend/API su Render
   - DB PostgreSQL su Render
   - futuro sottodominio `api.checks.energy`

## Contesto business/comunicazione (fondamentale)
Target: **agenzie territoriali / partner commerciali di vendita energia sul territorio**.

Messaggio chiave:
- supporto tecnico guidato per gestione dubbi sui consumi e controllo contatore
- NON è verifica metrologica ufficiale / perizia
- usare termini: attività / interventi / controlli guidati / supporto tecnico guidato
- report PDF customer-friendly da consegnare al cliente
- punto di forza: personalizzazione PDF con logo agenzia
- CTA principale: spingere il partner a contattare via mail

## Stato attuale (riassunto)
### Landing page
- Hero aggiornato con: “Supporto tecnico guidato • Gestione dubbi sui consumi e controllo contatore”
- Prezzi espliciti rimossi / da non mostrare in questa fase
- Frase condizioni economiche:
  “Condizioni economiche e configurazione del progetto pilota vengono definite in fase di contatto, in funzione della zona, della modalità operativa e dell’organizzazione dell’agenzia.”
- Contatto semplificato: solo email `info@checks.energy`
- Logo definitivo PNG e PDF demo anonimizzato già disponibili
- Hosting statico su Register.it già usato

### Portale agenzia
- Mock React con sezioni: Dashboard, Attività, Relazioni PDF, Crediti, Operatori, Branding agenzia
- Dati demo coerenti con il dominio applicativo

### Backend/API + DB
- Scelta: Render (backend Node + PostgreSQL)
- Utente registrato su Render (login Google)
- È arrivato alla schermata “Create a new Service”
- Vuole guida **una cosa alla volta**
- Primo step da fare: creare **Postgres** su Render

## Preferenze operative utente
- Guida step-by-step, una sola azione per volta
- Poche parole, istruzioni pratiche
- Controllo ad ogni step tramite screenshot/conferma

## Task da fare ORA
1. Guidarmi su Render (prima Postgres, poi Web Service)
2. Deploy backend minimo (Express + CORS + Postgres + /health)
3. Test endpoint `/health`
4. Collegare HTML portale con `fetch()` e CORS
5. Solo dopo: integrare API reali e rifinire UX

## Vincoli marketing/compliance
- Evitare “perizia” / “verifica ufficiale”
- Chiarire che il report non ha valore metrologico-legale
- Valorizzare supporto tecnico, processo guidato, PDF customer-friendly, branding agenzia

## Materiale allegato in questo ZIP
- Prompt handoff
- Backend starter Node/Express/Postgres
- schema SQL base
- pagina HTML test API
- mock React del portale (versione handoff)
- checklist Render

Parti dal primissimo step su Render e guidami una cosa alla volta.
