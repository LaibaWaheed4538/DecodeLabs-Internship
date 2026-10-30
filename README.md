# CURIO Museum
### An Interactive Digital Museum Experience

**DecodeLabs — Full Stack Development Internship | Batch 2026**

---

## 1. Project Overview

CURIO Museum is an interactive digital museum website designed to make historical learning engaging and accessible. Visitors can explore historical exhibits, discover timelines, participate in quizzes, save favorite artifacts, share community discoveries, and browse a museum-inspired marketplace.

Developed as part of the DecodeLabs Full Stack Development Internship, this project demonstrates four development milestones, progressing from responsive frontend development to backend APIs, database integration, and complete frontend–backend communication.

## 2. Getting Started

### Prerequisites

- Node.js (20.12 or newer)
- MySQL Server
- MySQL Workbench
- Git (optional)

### Installation and Setup

**Step 1 — Clone the repository**

```bash
git clone https://github.com/LaibaWaheed4538/DecodeLabs-Internship.git
cd DecodeLabs-Internship
```

**Step 2 — Configure the database**

1. Start MySQL Server.
2. Open MySQL Workbench.
3. Execute the `backend/schema.sql` file.
4. Copy `backend/.env.example` to `backend/.env`.
5. Enter your MySQL credentials in the `.env` file.

**Step 3 — Install backend dependencies**

```bash
cd backend
npm install
```

**Step 4 — Start the server**

```bash
npm run dev
```

For Windows PowerShell, use:

```powershell
npm.cmd run dev
```

**Step 5 — Access the application**

Once the server is running, open:

| Resource | URL |
|---|---|
| Main Website | http://localhost:5000 |
| API Health Check | http://localhost:5000/api/health |
| Community Discoveries | http://localhost:5000/community-discoveries.html |

Keep the backend server running while using the application.

---

## 3. Project 1 — Responsive Frontend Development

**Goal:** Build a responsive frontend interface using HTML, CSS, and basic JavaScript.

The first milestone focuses on mastering frontend fundamentals and creating an adaptable, user-friendly web experience.

**Key Features and Requirements:**

- Semantic HTML5 structure and meaningful elements.
- Responsive layouts for desktop, tablet, and mobile devices.
- Mobile-first development approach.
- CSS Grid and Flexbox for page layouts and components.
- JavaScript for basic interactions and state management.
- Consistent typography, colours, and visual design.
- Accessible and user-friendly interface.

**Implementation:** The CURIO Museum frontend uses HTML5, CSS3, and vanilla JavaScript without frontend frameworks.

## 4. Project 2 — Backend API Development

**Goal:** Develop a simple backend API to handle application logic.

This milestone introduces server-side programming and communication between the frontend and backend.

**Key Features and Requirements:**

- Node.js and Express.js backend.
- REST API endpoints using GET and POST methods.
- Handling incoming requests and sending responses.
- Basic input validation.
- JSON-based data exchange.
- Appropriate HTTP status codes and error responses.

**Implementation:** Express.js provides API endpoints for exhibits, timelines, quizzes, marketplace products, demo orders, and community discoveries.

### Main API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Server health check |
| GET | `/api/exhibits` | Retrieve exhibits |
| GET | `/api/timeline` | Retrieve historical events |
| GET | `/api/quiz` | Retrieve quiz questions |
| POST | `/api/quiz/answers` | Validate quiz answers |
| GET | `/api/marketplace` | Retrieve products |
| POST | `/api/orders` | Submit a demo order |
| GET | `/api/discoveries` | Retrieve discoveries |
| POST | `/api/discoveries` | Create a discovery |
| PUT | `/api/discoveries/:id` | Update a discovery |
| DELETE | `/api/discoveries/:id` | Delete a discovery |

## 5. Project 3 — Database Integration

**Goal:** Connect the backend with a database to store and retrieve information.

This milestone focuses on database design, persistent storage, and CRUD operations.

**Key Features and Requirements:**

- MySQL database integration.
- Database schema design.
- Create, Read, Update, and Delete (CRUD) operations.
- Proper data handling and validation.
- Persistent storage of community-submitted information.
- Parameterized database queries.

**Database Details:**

| Component | Implementation |
|---|---|
| Database | `curio_museum` |
| Table | `community_discoveries` |
| Database System | MySQL |
| Schema File | `backend/schema.sql` |
| Configuration | `backend/.env` |

**Implementation:** The Community Discoveries module supports creating, retrieving, updating, and deleting records through backend API endpoints connected to MySQL.

## 6. Project 4 — Frontend & Backend Integration

**Goal:** Integrate frontend interfaces with backend APIs.

P4 is identified by DecodeLabs as an **Optional Mastery Phase**. It extends the earlier milestones by demonstrating how frontend interfaces communicate with backend services.

**Key Features and Requirements:**

- Sending frontend requests to backend APIs.
- Fetch API for HTTP communication.
- Asynchronous programming using `async/await`.
- JSON serialization and parsing.
- Displaying dynamic API data on the user interface.
- Handling HTTP errors and server responses.
- Defensive programming using `try/catch` and appropriate loading states.

**Implementation:** CURIO Museum integrates frontend pages with Express APIs. Data is retrieved and displayed dynamically, while Community Discoveries supports database-backed operations through the integrated application.

---

## 7. Functional Requirements

The application provides the following functionality:

1. Navigate between different museum sections.
2. Browse, search, and filter historical exhibits.
3. View artifact details and historical information.
4. Save and remove favorite exhibits.
5. Explore historical timelines.
6. Participate in interactive quizzes.
7. Create, view, update, and delete community discoveries.
8. Browse marketplace products.
9. Manage shopping cart items and quantities.
10. Submit simulated checkout requests.
11. Validate supported inputs and display appropriate feedback.
12. Retrieve and display dynamic data through backend APIs.

## 8. Non-Functional Requirements

- **Usability:** Simple navigation and intuitive user interactions.
- **Responsiveness:** Adaptable layouts across mobile, tablet, and desktop.
- **Accessibility:** Semantic HTML, readable typography, and appropriate colour contrast.
- **Performance:** Efficient page loading and responsive interactions.
- **Reliability:** Appropriate error handling and meaningful user feedback.
- **Maintainability:** Organized frontend and backend code structure.
- **Data Integrity:** Validated database inputs and structured records.
- **Security:** Parameterized SQL queries and protected database credentials.

## 9. Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Website structure |
| CSS3 | Styling and responsive layouts |
| JavaScript | Frontend interactions and logic |
| Node.js | Backend runtime |
| Express.js | API development |
| MySQL | Database management |
| Fetch API | Client-server communication |
| JSON | Data exchange |
| Git & GitHub | Version control |

## 10. Project Structure

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
└── README.md
```

## 11. Important Notes

- Node.js and MySQL must be installed before running the application.
- MySQL Server must be running for database-dependent functionality.
- Configure your local `backend/.env` file before starting the backend.
- Never upload actual database credentials to GitHub.
- The Community Discoveries module provides persistent MySQL CRUD functionality.
- Checkout is a demonstration feature; no real payment is processed and demo orders are not persistently stored in MySQL.
- The frontend and backend are served from the same Express origin at `localhost:5000` for local integration.

---

## 12. Acknowledgement

**Developed as part of the Full Stack Development Industrial Internship Program at DecodeLabs — Batch 2026.**

This project represents practical learning and implementation across responsive frontend development, backend API development, database integration, and full-stack application architecture.

**DecodeLabs — Learn, Build, and Grow.**