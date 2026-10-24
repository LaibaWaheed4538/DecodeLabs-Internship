# CURIO Museum

**An Interactive Digital Museum Experience**

## 1. Project Overview

CURIO Museum is an interactive web-based museum platform developed as part of the **DecodeLabs Internship**. It aims to make historical artifacts, ancient civilizations, and cultural heritage more accessible through a modern digital experience.

The platform allows users to explore museum exhibits, view historical timelines, save favorite artifacts, participate in educational quizzes, share discoveries, and browse museum-inspired products.

The project combines a responsive frontend with a Node.js and Express backend to demonstrate interactive web development and API integration.

## 2. Project Objectives

The main objectives of CURIO Museum are to:

- Create a responsive and user-friendly digital museum.
- Present historical artifacts in an organized and engaging way.
- Provide searching, filtering, and bookmarking functionality.
- Encourage learning through interactive quizzes and timelines.
- Allow visitors to create and manage community discoveries.
- Demonstrate shopping cart and checkout functionality.
- Integrate frontend features with backend APIs.
- Implement basic input validation and error handling.

## 3. Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Website structure and content |
| CSS3 | Styling and responsive design |
| JavaScript | Dynamic content and user interactions |
| Node.js | Backend runtime environment |
| Express.js | API development and request handling |
| JSON | Data exchange between frontend and backend |
| Local Storage | Browser-based data persistence |
| Git & GitHub | Version control and repository management |

## 4. Key Features

### Home Page
Introduces CURIO Museum and provides navigation to its main sections, including featured exhibits and interactive activities.

### Discover Exhibits
Displays a collection of 12 historical exhibits. Users can search, filter, sort, and browse exhibits based on their interests.

### Exhibit Details
Provides detailed information about selected artifacts, including images, descriptions, historical context, and related discoveries.

### My Collection
Allows visitors to bookmark favorite exhibits, view saved items, and remove bookmarks. Collection data is stored locally in the browser.

### Historical Timeline
Presents eight historical events in chronological order, with searching and filtering options to explore different periods.

### Museum Challenge
An interactive quiz containing ten questions. Users can select answers, receive feedback, track scores, and restart the challenge.

### Community Discoveries
Allows visitors to publish discoveries and manage their contributions through create, read, update, and delete operations.

Each discovery includes historical information such as its title, category, period, location, contributor, and description.

### Museum Marketplace
Displays six museum-inspired products. Visitors can browse items, add products to their cart, and manage their selections.

### Demo Checkout
Provides a simulated checkout process where users can review their cart, enter customer information, and submit a demo order.

No real payments are processed.

## 5. How the System Works

CURIO Museum follows a frontend and backend architecture.

**Frontend:** HTML, CSS, and JavaScript manage the user interface, navigation, interactive features, and dynamic content.

**Backend:** Node.js and Express provide API endpoints for exhibits, historical events, quizzes, community discoveries, marketplace products, and demo orders.

**API Communication:** JavaScript uses the `fetch()` API to send HTTP requests and receive JSON responses.

For example, when a visitor opens the Discover page, the frontend requests exhibit data through `/api/exhibits`. The backend returns the available exhibits, which are then displayed as cards.

Selected pages also support local data or browser storage as a fallback when the backend is unavailable.

## 6. Functional Requirements

The system provides the following functionality:

1. **Navigation:** Allow users to access different museum sections.
2. **Exhibit Management:** Display exhibits and individual artifact details.
3. **Search and Filtering:** Search, sort, and filter available exhibits.
4. **Bookmarking:** Save and remove favorite exhibits.
5. **Historical Timeline:** Display and filter historical events.
6. **Interactive Quiz:** Present questions, check answers, and calculate scores.
7. **Community Discoveries:** Create, view, edit, search, and delete discoveries.
8. **Marketplace:** Display products and manage shopping cart items.
9. **Demo Checkout:** Validate customer details and demonstrate order submission.
10. **API Integration:** Exchange data between frontend and backend.
11. **Input Validation:** Validate required fields and supported requests.
12. **Error Handling:** Display appropriate feedback when operations fail.

## 7. Non-Functional Requirements

- **Usability:** Clear navigation, readable content, and simple interactions.
- **Responsiveness:** Adaptable layouts for desktop, tablet, and mobile screens.
- **Performance:** Efficient content loading and responsive user interactions.
- **Reliability:** Basic error handling and fallback support for selected features.
- **Maintainability:** Organized, readable, and reusable code.
- **Compatibility:** Support for modern web browsers.
- **Data Handling:** Structured JSON communication and basic backend validation.
- **Security:** Basic request validation; production authentication and payment security are outside the current scope.

## 8. Backend API Endpoints

The Express backend provides the following endpoints:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check server status |
| GET | `/api/exhibits` | Retrieve all exhibits |
| GET | `/api/exhibits/:id` | Retrieve a specific exhibit |
| GET | `/api/timeline` | Retrieve timeline events |
| GET | `/api/quiz` | Retrieve quiz questions |
| POST | `/api/quiz/check` | Validate quiz answers |
| GET | `/api/discoveries` | Retrieve community discoveries |
| POST | `/api/discoveries` | Publish a discovery |
| POST | `/api/discoveries/:id/edit` | Update a discovery |
| POST | `/api/discoveries/:id/delete` | Delete a discovery |
| GET | `/api/marketplace` | Retrieve marketplace products |
| POST | `/api/orders` | Submit a demo order |

The backend processes requests, performs basic validation, and returns JSON responses with appropriate HTTP status codes.

## 9. Project Structure

```text
CURIO/
├── assets/
├── css/
├── js/
│   ├── data.js
│   ├── main.js
│   ├── discover.js
│   ├── exhibit.js
│   ├── collection.js
│   ├── timeline.js
│   ├── challenge.js
│   ├── community-discoveries.js
│   ├── marketplace.js
│   └── billing.js
├── backend/
│   ├── data/
│   │   └── exhibits.js
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

## 10. Installation and Setup

### Prerequisites

- Node.js and npm
- Visual Studio Code or another code editor
- A modern web browser

### Step 1: Clone the Repository

```bash
git clone <repository-url>
```

Open the downloaded project folder in your code editor.

### Step 2: Install Backend Dependencies

Navigate to the backend directory:

```bash
cd backend
npm install
```

### Step 3: Start the Server

```bash
npm run dev
```

On Windows PowerShell, use `npm.cmd` if the execution policy prevents `npm` from running.

### Step 4: Open the Application

Once the server starts, open:

```text
http://localhost:5000
```

The Express server serves the website and handles backend API requests during local development.

To verify the backend, visit:

```text
http://localhost:5000/api/health
```

## 11. Testing

The application can be tested through its interactive pages and API endpoints.

**Frontend Testing**
- Check website navigation and responsive layouts.
- Test exhibit search, filtering, and bookmarks.
- Verify timeline events and quiz functionality.
- Create, edit, and delete community discoveries.
- Test shopping cart and demo checkout.

**Backend Testing**
- Verify GET and POST API responses.
- Check input validation and error handling.
- Test quiz answer verification.
- Test community discovery operations.
- Confirm demo order responses.

## 12. Deployment

The intended deployment architecture uses:

- **Vercel:** Frontend hosting.
- **Railway:** Node.js and Express backend hosting.

Frontend API requests must be configured to communicate with the deployed backend. Production integration requires testing before the deployment can be considered complete.

## 13. Current Limitations

CURIO Museum is an educational project and does not include a production database, user authentication, or real payment processing.

Backend community discoveries are currently stored in memory and may be lost when the server restarts. Local storage data is limited to the browser where it was created.

Future improvements could include persistent database storage, user accounts, an administrative dashboard, and additional educational content.

## 14. Conclusion

CURIO Museum demonstrates the development of an interactive web application by combining frontend design, JavaScript functionality, and backend API integration.

The project provides an engaging way to explore history while demonstrating practical web development concepts such as dynamic content rendering, API communication, input validation, and data management.

It was developed as part of the **DecodeLabs Internship** to apply and strengthen frontend and backend development skills.