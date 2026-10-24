# CURIO Museum

**A digital museum built for curious minds.**

CURIO Museum is a responsive and interactive website where visitors can explore history, science, nature, inventions, and discoveries from around the world.

I developed this project as part of the **DecodeLabs Full Stack Development Internship 2026**, starting with the frontend and later integrating a Node.js and Express backend.

### Live Website

**[Explore CURIO Museum](https://curio-museum.vercel.app)**

## About the Project

The idea behind CURIO Museum was to create a digital space where learning and exploring feel engaging rather than complicated.

Visitors can browse museum exhibits, explore historical timelines, discover interesting facts, take quizzes, and share their own discoveries.

The project was completed in two stages:

**Project 1 — Frontend Development**

Built a responsive website using HTML, CSS, and JavaScript, focusing on clean layouts, navigation, accessibility, and interactive user experiences.

**Project 2 — Backend API Development**

Developed REST-style APIs using Node.js and Express.js to retrieve exhibit data, manage community discoveries, validate user input, and handle server responses.

## Features

- **Explore Exhibits:** Discover historical artifacts, scientific achievements, inventions, and natural wonders.
- **Historical Timeline:** Browse important events and discoveries throughout history.
- **Knowledge Challenge:** Test your knowledge through interactive quizzes.
- **My Collection:** Bookmark interesting exhibits for later.
- **Community Discoveries:** Share, edit, and delete discoveries through backend APIs.
- **Marketplace:** Browse products and manage items in a shopping cart.
- **Demo Billing:** Review your order details and experience a simulated checkout.

## Tech Stack

| Frontend | Backend |
|---|---|
| HTML5 | Node.js |
| CSS3 | Express.js |
| JavaScript | REST-style APIs |
| Responsive Design | JSON |

## Getting Started

To run CURIO Museum locally, make sure **Node.js** and **npm** are installed.

**1. Download or clone the project**

Clone the repository using its GitHub URL, or download the project ZIP and extract it.

**2. Open the project in VS Code**

Open the main project folder containing `index.html` and the `backend` folder.

**3. Navigate to the backend folder**

```bash
cd backend
```

**4. Install dependencies**

```bash
npm install
```

**5. Start the development server**

```bash
npm run dev
```

**6. Open the application**

Once the server is running, visit:

http://127.0.0.1:5000

**Windows PowerShell users:** If `npm` is blocked by the execution policy, use `npm.cmd install` and `npm.cmd run dev` instead.

The server uses port `5000` by default, or the port specified through the `PORT` environment variable.

## Backend API Endpoints

The backend provides the following endpoints:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check server status |
| GET | `/api/exhibits` | Retrieve all museum exhibits |
| GET | `/api/exhibits/:id` | Retrieve a specific exhibit |
| GET | `/api/discoveries` | Retrieve community discoveries |
| POST | `/api/discoveries` | Submit a new discovery |
| POST | `/api/discoveries/:id/edit` | Update an existing discovery |
| POST | `/api/discoveries/:id/delete` | Delete a discovery |

The API supports JSON requests and responses, required-field validation, and appropriate HTTP status codes for successful and invalid requests.

## Current Limitations

Community discoveries are currently stored in server memory, meaning they reset when the backend server restarts.

The marketplace and billing sections are frontend demonstration features. No real payments are processed.

The live website is hosted on Vercel. Backend API functionality has been developed and tested locally; the live deployment should not be assumed to include the Express backend.

## Acknowledgment

Developed as part of the **DecodeLabs Full Stack Development Industrial Training Program — Batch 2026**.