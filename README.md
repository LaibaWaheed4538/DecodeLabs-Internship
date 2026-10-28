An Interactive Digital Museum Experience
DecodeLabs Full Stack Development Internship --- Batch 2026
Project Overview
CURIO Museum is a responsive, interactive museum website for exploring
historical exhibits and cultural heritage. Visitors can browse
artifacts, explore a historical timeline, take a quiz, save favorite
exhibits, share community discoveries, and browse museum-inspired
products.

This repository brings together the three internship milestones: P1
--- Responsive Frontend Interface, P2 --- Backend API Development, and
P3 --- Database Integration.
Project 1 --- Responsive Frontend Interface
Goal: Create a clean, user-friendly interface that adapts to
different screen sizes.
- Built with HTML5, CSS3, and JavaScript.
- Responsive page layouts and navigation.
- Museum pages for exhibits, artifact details, timeline, quiz,
  collection, community discoveries, marketplace, and demo checkout.
- Search, filtering, and interactive controls where supported.
To view: Start the application using the setup instructions below,
then open http://localhost:5000.
Project 2 --- Backend API Development
Goal: Build backend endpoints that receive requests, process input,
and return responses.
- Node.js and Express.js backend.
- JSON request and response handling.
- API routes for supported museum features.
- Basic input validation and error responses.
Start the backend:
cd backend
npm install
npm run dev
On Windows PowerShell, use npm.cmd run dev if PowerShell blocks npm.

The server runs at http://localhost:5000 by default. The Express
server also serves the frontend, so you can use the same address to open
the website.

Health endpoint: http://localhost:5000/api/health
Project 3 --- Database Integration
Goal: Connect the backend to a database to store and retrieve
community discoveries.
- MySQL database: curio_museum
- Table: community_discoveries
- Create, Read, Update, and Delete (CRUD) operations through the
  backend API.
- Schema constraints for required discovery fields.
Database Setup
1. Install and start MySQL.
2. Open backend/schema.sql in MySQL Workbench and execute it.
3. Copy backend/.env.example to backend/.env.
4. Update backend/.env with your local MySQL credentials.
5. From the backend folder, run npm install and npm run dev.
6. Open http://localhost:5000/community-discoveries.html to use the
   Community page.
The .env file contains local credentials and must not be committed to
GitHub. Commit .env.example instead.
Database Verification
In MySQL Workbench, run:
USE curio_museum;

SELECT id, title, category, created_at
FROM community_discoveries
ORDER BY created_at DESC;
Add, edit, and delete a discovery through the Community page, then run
the query again to confirm that database records reflect the changes.
Functional Requirements
The application supports the following functions:
1. Navigate between museum pages.
2. Browse exhibits and view artifact details.
3. Search and filter content on supported pages.
4. Save and remove favorite exhibits in the browser collection.
5. Browse and filter historical timeline events.
6. Answer quiz questions and view feedback and scores.
7. Create, view, edit, and delete community discoveries through the
   backend and MySQL database.
8. Browse marketplace products and manage cart items.
9. Submit a simulated checkout; no real payment is processed.
10. Validate supported form inputs and display operation feedback.
Non-Functional Requirements
- Usability: Clear navigation and understandable page controls.
- Responsiveness: Layouts adapt to desktop and mobile screen
  sizes.
- Accessibility: Readable content and colour contrast are
  considered in the interface.
- Performance: Pages and interactions should respond promptly
  under normal local use.
- Reliability: Backend requests return responses and errors are
  handled.
- Maintainability: Frontend assets and backend code are separated
  into organized files.
- Data integrity: Community discovery records follow the MySQL
  schema and required-field constraints.
- Security: Database credentials are kept in the local .env
  file, not committed to the repository.
Other Website Features
- Home: Overview and navigation to museum sections.
- Discover Exhibits: Browse, search, filter, and sort exhibits.
- Exhibit Details: Artifact imagery, descriptions, and historical
  context.
- My Collection: Browser-based bookmarks for favorite exhibits.
- Historical Timeline: Historical events with search and
  filtering.
- Museum Challenge: Interactive quiz with answer feedback and
  scoring.
- Community Discoveries: Community-submitted discoveries managed
  through CRUD operations.
- Museum Marketplace: Product browsing and shopping cart.
- Demo Checkout: Demonstration checkout only; no real payments.
Technologies Used
  Technology       Purpose
  HTML5            Page structure
  CSS3             Styling and responsive layouts
  JavaScript       Interactions and API requests
  Node.js          Backend runtime
  Express.js       HTTP API and static file serving
  MySQL            Persistent storage for community discoveries
  JSON             API data exchange
  Git and GitHub   Version control
Project Structure
CURIO Museum/
├── assets/
├── css/
├── js/
├── backend/
│   ├── data/
│   ├── schema.sql
│   ├── .env.example
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
├── index.html
├── discover.html
├── exhibit.html
├── collection.html
├── timeline.html
├── challenge.html
├── community-discoveries.html
├── marketplace.html
├── billing.html
├── about.html
└── README.md
Notes
- MySQL must be running for database-backed Community Discoveries.
- The website and API are available from the Express server at
  http://localhost:5000 during local development.
- A separate static frontend server uses a different origin; in that
  case, its API URL and backend CORS configuration must match the
  local setup.
- The Vercel URL is a preview deployment. It does not automatically
  connect to your laptop's local MySQL database.
- The checkout is a demo and does not process real payments.