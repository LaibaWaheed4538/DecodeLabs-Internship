CURIO Museum
An Interactive Digital Museum Experience
1. Project Overview
CURIO Museum is an interactive web-based museum platform developed as
part of the DecodeLabs Internship. It helps visitors explore
historical exhibits, ancient civilizations, and cultural heritage
through a modern digital experience.

Visitors can browse exhibits, explore historical timelines, take
quizzes, save favorite artifacts, share community discoveries, and
browse museum-inspired products.
2. Project 1 --- Frontend and Responsive Design
Project 1 focuses on the website interface, page structure, styling,
responsiveness, and accessibility.

Includes: - Semantic HTML5 page structure. - CSS styling with
responsive layouts. - Navigation between museum sections. - Search and
filtering interfaces. - Interactive exhibit, timeline, quiz, collection,
community, and marketplace pages. - Accessibility and readable colour
contrast.

How to check: Open index.html in a browser and navigate through
the website pages. Test the layout at desktop and mobile widths.
3. Project 2 --- Backend and API Integration
Project 2 connects the website to a Node.js and Express backend. The
backend provides API endpoints and returns JSON responses for supported
features.

Includes: - REST-style API routes. - GET and POST requests for
supported features. - Input validation and error handling. -
Frontend-to-backend communication using JavaScript fetch().

How to run the backend:
1. Install Node.js.
2. Open a terminal in the project folder.
3. Run:
   cd backend
   npm install
   npm run dev
4. The backend runs at http://localhost:5000.
5. Check the API at http://localhost:5000/api/health.
Keep the backend running while testing features that use the API.
4. Project 3 --- MySQL Database Integration
Project 3 connects Community Discoveries to a MySQL database so
discovery records can be created, viewed, updated, and deleted.

Includes: - MySQL database: curio_museum - Table:
community_discoveries - CRUD operations through the backend API. -
Basic database constraints and input validation.

Database setup:
1. Start MySQL.
2. Open backend/schema.sql in MySQL Workbench and execute it.
3. Create backend/.env using backend/.env.example as a guide.
4. Add your local MySQL connection details to backend/.env.
5. Start the backend using the commands in Project 2.
Test the database integration: - Add a discovery on the Community
page and confirm it appears in MySQL. - Refresh the page and confirm the
discovery is still displayed. - Edit a discovery and check the updated
values in MySQL. - Delete a discovery and confirm the record is removed.

Keep real database credentials in backend/.env and do not commit that
file to GitHub.
5. Functional Requirements
The website provides these user-facing functions:
1. Navigation: Users can move between the museum pages.
2. Exhibit browsing: Users can view exhibit cards and individual
   exhibit details.
3. Search and filtering: Users can search and filter available
   exhibits and discoveries where supported.
4. Bookmarks: Users can save and remove favorite exhibits in their
   browser collection.
5. Timeline: Users can browse historical events and filter the
   timeline.
6. Quiz: Users can answer quiz questions, receive feedback, and
   view their score.
7. Community discoveries: Users can create, view, search, edit, and
   delete discoveries through the Community page.
8. Marketplace: Users can browse products and manage cart items.
9. Demo checkout: Users can enter checkout details and submit a
   simulated order; no real payment is processed.
10. API communication: Frontend JavaScript can request data from
    backend API endpoints.
11. Validation and errors: Required inputs are checked and the
    interface displays feedback for supported errors.
6. Non-Functional Requirements
- Usability: Pages should be clear and easy to navigate.
- Responsiveness: Layouts should adapt to desktop, tablet, and
  mobile screen sizes.
- Accessibility: Text and controls should remain readable and
  usable, including sufficient colour contrast.
- Performance: Pages and interactions should respond in a
  reasonable time.
- Reliability: API failures should be handled with useful
  feedback.
- Maintainability: HTML, CSS, JavaScript, and backend code should
  remain organized.
- Compatibility: The website should work in modern browsers.
- Data integrity: Community discovery records should follow the
  database schema and validation rules.
- Security: Real database credentials must stay in .env and must
  not be committed to GitHub.
7. Other Website Features
Home Page
Introduces CURIO Museum and links to its main sections.
Discover Exhibits
Displays historical exhibits with search, filtering, sorting, and
browsing options.
Exhibit Details
Shows artifact images, descriptions, and historical context.
My Collection
Allows visitors to bookmark favorite exhibits. Collection data is stored
in the browser.
Historical Timeline
Presents historical events with search and filtering options.
Museum Challenge
Provides an interactive quiz with answer feedback and scoring.
Community Discoveries
Allows visitors to publish, view, search, edit, and delete discoveries.
Museum Marketplace
Displays museum-inspired products and provides a shopping cart.
Demo Checkout
Simulates checkout and order submission. No real payments are processed.
8. Technologies Used
  Technology       Purpose
  HTML5            Website structure
  CSS3             Styling and responsive design
  JavaScript       User interactions and API requests
  Node.js          Backend runtime
  Express.js       API routes and request handling
  MySQL            Persistent storage for community discoveries
  JSON             Data exchange
  Git and GitHub   Version control
9. Project Structure
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
10. Testing Checklist
- Navigate through the website pages.
- Test responsive layouts, search, and filters.
- Check backend health at /api/health.
- Test community discovery create, read, update, and delete
  operations.
- Verify database changes in MySQL Workbench.
- Confirm that .env credentials are not included in the repository.
11. Notes
- Node.js and MySQL must be installed to run the backend and database
  locally.
- Configure backend/.env with your own MySQL credentials before
  testing database features.
- The checkout is a demonstration only and does not process real
  payments.
- The Vercel deployment is for preview/testing; local MySQL is not
  automatically connected to the deployed site.