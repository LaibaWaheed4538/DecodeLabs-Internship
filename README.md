# CURIO Museum
### An Interactive Digital Museum Experience

**DecodeLabs — Full Stack Development Internship | Batch 2026**

**Live Website:** https://decodelabs-internship-production.up.railway.app/  
**GitHub Repository:** https://github.com/LaibaWaheed4538/DecodeLabs-Internship

---

## 1. Project Overview

CURIO Museum is an interactive digital museum website designed to make historical learning engaging and accessible.

Visitors can explore historical exhibits, discover timelines, participate in quizzes, save favourite artifacts, share community discoveries, and browse a museum-inspired marketplace.

Developed as part of the DecodeLabs Full Stack Development Internship, this project demonstrates four development milestones, progressing from responsive frontend development to backend APIs, database integration, and frontend–backend communication.

## 2. Live Deployment

The application is deployed on Railway and is publicly accessible.

| Resource | Link |
|---|---|
| Live Website | https://decodelabs-internship-production.up.railway.app/ |
| Backend Health Check | https://decodelabs-internship-production.up.railway.app/api/health |
| Community Discoveries | https://decodelabs-internship-production.up.railway.app/community-discoveries.html |
| GitHub Repository | https://github.com/LaibaWaheed4538/DecodeLabs-Internship |

The deployed application uses:
- Railway for application hosting.
- Node.js and Express.js for backend services.
- Railway MySQL for persistent Community Discoveries storage.

## 3. Getting Started — Local Installation

### Prerequisites

- Node.js 20.12 or newer
- MySQL Server
- MySQL Workbench (recommended)
- Git (optional)

### Step 1 — Clone the Repository

```bash
git clone https://github.com/LaibaWaheed4538/DecodeLabs-Internship.git
cd DecodeLabs-Internship
```

### Step 2 — Configure MySQL

1. Start MySQL Server.
2. Open MySQL Workbench.
3. Execute `backend/schema.sql`.
4. Copy `backend/.env.example` to `backend/.env`.
5. Add your local MySQL credentials.

Example environment configuration:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=curio_museum
```

Use your actual local MySQL credentials. Never upload `.env` to GitHub.

### Step 3 — Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 4 — Start the Development Server

```bash
npm run dev
```

For Windows PowerShell, if required:

```powershell
npm.cmd run dev
```

### Step 5 — Access the Application

Once the server is running, open:

| Resource | Local URL |
|---|---|
| Main Website | http://localhost:5000 |
| API Health Check | http://localhost:5000/api/health |
| Community Discoveries | http://localhost:5000/community-discoveries.html |

Keep the backend server running while using the application.

---

## 4. Project 1 — Responsive Frontend Development

**Goal:** Build a responsive frontend interface using HTML, CSS, and JavaScript.

### Key Requirements

- Semantic HTML5 structure.
- Responsive layouts for desktop, tablet, and mobile.
- Mobile-first development approach.
- CSS Grid and Flexbox.
- JavaScript-based interactions.
- Consistent typography, colours, and visual design.
- Accessible and user-friendly navigation.

**Implementation:** CURIO Museum uses HTML5, CSS3, and vanilla JavaScript without frontend frameworks.

## 5. Project 2 — Backend API Development

**Goal:** Develop a backend application using Node.js and Express.js.

### Key Requirements

- REST API development.
- GET and POST request handling.
- Request and response management.
- Input validation.
- JSON-based data exchange.
- Appropriate HTTP status codes.
- Error handling.

### Main API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Server health check |
| GET | `/api/exhibits` | Retrieve exhibits |
| GET | `/api/exhibits/:id` | Retrieve an individual exhibit |
| GET | `/api/timeline` | Retrieve historical events |
| GET | `/api/quiz` | Retrieve quiz questions |
| POST | `/api/quiz/answers` | Validate quiz answers |
| GET | `/api/marketplace` | Retrieve marketplace products |
| POST | `/api/orders` | Submit a demo order |
| GET | `/api/discoveries` | Retrieve community discoveries |
| POST | `/api/discoveries` | Create a discovery |
| PUT | `/api/discoveries/:id` | Update a discovery |
| DELETE | `/api/discoveries/:id` | Delete a discovery |

**Implementation:** Express.js provides the application's backend APIs and handles requests from the frontend.

## 6. Project 3 — Database Integration

**Goal:** Connect the backend with MySQL for persistent data storage.

### Key Requirements

- MySQL database integration.
- Database schema design.
- Create, Read, Update, and Delete operations.
- Input validation.
- Persistent storage.
- Parameterized SQL queries.

### Database Details

| Component | Implementation |
|---|---|
| Database System | MySQL |
| Local Database | `curio_museum` |
| Production Database | Railway MySQL |
| Table | `community_discoveries` |
| Schema File | `backend/schema.sql` |
| Configuration | `backend/.env` |

**Implementation:** The Community Discoveries module supports database-backed CRUD operations. Users can create, retrieve, edit, and delete community-submitted records.

## 7. Project 4 — Frontend & Backend Integration

**Goal:** Integrate frontend interfaces with backend APIs.

P4 is treated as an optional mastery phase, extending the previous milestones through complete frontend–backend communication.

### Key Requirements

- Frontend requests to backend APIs.
- Fetch API for HTTP communication.
- Asynchronous programming using `async/await`.
- JSON serialization and parsing.
- Dynamic data rendering.
- HTTP error handling.
- Defensive programming using `try/catch`.

**Implementation:** CURIO Museum uses Fetch API and Express endpoints to retrieve and display dynamic data. Community Discoveries supports database-backed operations through the integrated application.

---

## 8. Functional Requirements

The application provides the following functionality:

1. Navigate between different museum sections.
2. Browse, search, and filter historical exhibits.
3. View artifact details and historical information.
4. Save and remove favourite exhibits.
5. Explore historical timelines.
6. Participate in interactive quizzes.
7. Create community discoveries.
8. View existing community submissions.
9. Edit and delete community discoveries.
10. Browse marketplace products.
11. Manage shopping cart items and quantities.
12. Submit simulated checkout requests.
13. Validate supported inputs and display feedback.
14. Retrieve and display dynamic data through backend APIs.

## 9. Non-Functional Requirements

- **Usability:** Simple navigation and intuitive user interactions.
- **Responsiveness:** Adaptable layouts across mobile, tablet, and desktop.
- **Accessibility:** Semantic HTML, readable typography, and appropriate colour contrast.
- **Performance:** Efficient page loading and responsive interactions.
- **Reliability:** Appropriate error handling and meaningful feedback.
- **Maintainability:** Organized frontend and backend code.
- **Data Integrity:** Validated inputs and structured database records.
- **Security:** Parameterized SQL queries and protected database credentials.

---

## 10. Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Website structure |
| CSS3 | Styling and responsive layouts |
| JavaScript | Frontend interactions |
| Node.js | Backend runtime |
| Express.js | API development |
| MySQL | Database management |
| Fetch API | Client-server communication |
| JSON | Data exchange |
| Git & GitHub | Version control |
| Railway | Application hosting |

## 11. Project Structure

```text
CURIO Museum/
│
├── assets/
├── css/
│   ├── style.css
│   ├── components.css
│   └── responsive.css
│
├── js/
│   ├── main.js
│   ├── data.js
│   ├── discover.js
│   ├── timeline.js
│   ├── challenge.js
│   ├── community-discoveries.js
│   ├── marketplace.js
│   └── billing.js
│
├── backend/
│   ├── data/
│   ├── schema.sql
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
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
│
├── package.json
└── README.md
```

## 12. Testing and Verification

The following features have been tested on the deployed application:

| Test | Result |
|---|---|
| Public website access | Passed |
| Backend health check | Passed |
| MySQL connectivity | Passed |
| Community CREATE | Passed |
| Community READ | Passed |
| Community UPDATE | Passed |
| Community DELETE | Passed |
| Billing demo order | Passed |

## 13. Important Notes

- Node.js and MySQL must be installed for local development.
- MySQL Server must be running for database-dependent functionality.
- Configure `backend/.env` before starting the local backend.
- Never upload actual database credentials to GitHub.
- The production database is hosted separately through Railway MySQL.
- Community Discoveries records are stored persistently in MySQL.
- Checkout is a demonstration feature. No real payment is processed, and demo orders are not persistently stored in MySQL.
- The application serves its frontend and backend from the same Express origin.

## 14. Acknowledgement

Developed as part of the **Full Stack Development Industrial Internship Program at DecodeLabs — Batch 2026.**

This project represents practical learning and implementation across responsive frontend development, backend API development, database integration, and full-stack application architecture.

**DecodeLabs — Learn, Build, and Grow.**
