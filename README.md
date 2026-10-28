# CURIO Museum

**An Interactive Digital Museum Experience**  
**DecodeLabs Full Stack Development Internship**

## 1. Project Overview

CURIO Museum is an interactive digital museum website where visitors can
explore historical exhibits, learn through timelines and quizzes, save
favorite artifacts, share community discoveries, and browse
museum-inspired products.

The project is organized around three internship milestones: **P1 —
Frontend**, **P2 — Backend APIs**, and **P3 — MySQL Database
Integration**.

## 2. Project 1 — Frontend

The frontend provides the website layout, styling, navigation, and
interactive pages.

- Responsive HTML, CSS, and JavaScript interface.
- Exhibit browsing, search, filtering, and artifact details.
- Historical timeline and interactive quiz.
- Browser-based saved collection.
- Community discoveries, marketplace, and demo checkout.

**Open the website:** Follow the backend instructions below, then visit
`http://localhost:5000`.

## 3. Project 2 — Backend API

The backend uses Node.js and Express to provide API endpoints and JSON
responses.

**Run the backend:**

``` bash
cd backend
npm install
npm run dev
```

On Windows PowerShell, use `npm.cmd run dev` if required.

The server runs at `http://localhost:5000`. Health check:
`http://localhost:5000/api/health`.

Open the website through this Express server address so frontend API
requests reach the backend.

## 4. Project 3 — MySQL Database Integration

Community Discoveries uses MySQL to store discovery records and supports
Create, Read, Update, and Delete (CRUD) operations.

- **Database:** `curio_museum`
- **Table:** `community_discoveries`
- **Schema file:** `backend/schema.sql`
- **Environment template:** `backend/.env.example`

### Setup

1.  Install and start MySQL.
2.  Run `backend/schema.sql` in MySQL Workbench.
3.  Copy `backend/.env.example` to `backend/.env`.
4.  Enter your own MySQL credentials in `backend/.env`.
5.  Start the backend using the commands in Project 2.
6.  Open `http://localhost:5000/community-discoveries.html`.

### Verify saved discoveries

Run this query in MySQL Workbench:

``` sql
USE curio_museum;

SELECT id, title, category, created_at
FROM community_discoveries
ORDER BY created_at DESC;
```

Add, edit, and delete a discovery from the Community page, then run the
query again to confirm the database reflects the changes.

**Security:** Keep real credentials in `backend/.env`. Do not commit
that file to GitHub; commit `.env.example` instead.

## 5. Functional Requirements

- Navigate between the museum pages.
- Browse exhibits and view artifact details.
- Search and filter content on supported pages.
- Save and remove favorite exhibits in the browser collection.
- Browse historical timeline events and use the quiz.
- Create, view, edit, and delete community discoveries using the backend
  and database.
- Browse marketplace products and manage cart items.
- Submit a simulated checkout. No real payment is processed.
- Validate supported form inputs and show operation feedback.

## 6. Non-Functional Requirements

- **Usability:** Clear navigation and understandable controls.
- **Responsiveness:** Layout adapts to desktop and mobile screens.
- **Accessibility:** Readable content and colour contrast are
  considered.
- **Performance:** Pages and interactions should respond promptly under
  normal use.
- **Reliability:** API errors are handled with feedback.
- **Maintainability:** Frontend and backend files are organized
  separately.
- **Data integrity:** Discovery fields follow the database schema and
  validation rules.
- **Security:** Database credentials are kept out of source control.

## 7. Other Website Features

- **Home:** Project introduction and navigation.
- **Discover Exhibits:** Browse, search, filter, and sort exhibits.
- **Exhibit Details:** Artifact images and historical context.
- **My Collection:** Browser-based bookmarks.
- **Historical Timeline:** Historical events with search and filtering.
- **Museum Challenge:** Quiz questions, feedback, and scoring.
- **Community Discoveries:** User-submitted discovery management.
- **Museum Marketplace:** Product browsing and shopping cart.
- **Demo Checkout:** Simulated checkout only.

## 8. Technologies Used

| Technology              | Purpose                                      |
|-------------------------|----------------------------------------------|
| HTML5, CSS3, JavaScript | Frontend interface and interactions          |
| Node.js, Express.js     | Backend server and APIs                      |
| MySQL                   | Persistent storage for community discoveries |
| JSON                    | API data exchange                            |
| Git and GitHub          | Version control                              |

## 9. Project Structure

``` text
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
```

## 10. Notes

- Node.js and MySQL must be installed for local backend/database use.
- Configure `backend/.env` before starting the backend.
- Use `http://localhost:5000` for local testing; opening the frontend
  through a separate static server may send API requests to the wrong
  port.
- The Vercel preview does not automatically connect to your computer’s
  local MySQL database.
- The checkout is a demonstration and does not process real payments.
