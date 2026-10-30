// Load the packages needed to run the backend server.
const express = require("express");
const path = require("node:path");
const crypto = require("node:crypto");
const fs = require("node:fs");
const vm = require("node:vm");
const process = require("node:process");

// Load environment variables from backend/.env.
// The server still starts if the file is missing; database routes then
// answer with a clear 500 error instead of the whole server crashing.
try {
  process.loadEnvFile(path.join(__dirname, ".env"));
} catch (error) {
  console.warn("backend/.env not found. Copy .env.example to .env and add your MySQL settings.");
}

// Use the promise-based MySQL driver for database queries.
const mysql = require("mysql2/promise");

// Create a connection pool using the database settings from .env.
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Load the existing exhibit data.
const exhibits = require("./data/exhibits");
const context = { window: {} };

// Read the shared data file used by the frontend.
const source = fs.readFileSync(path.join(__dirname, "../js/data.js"), "utf8");

// Make the shared timeline and quiz data available to the backend.
vm.runInNewContext(source, context);

const timeline = context.window.CURIO_DATA.timeline;
const quizQuestions = context.window.CURIO_DATA.quizQuestions;

// Set up the Express application and its port.
const app = express();
const PORT = process.env.PORT || 5000;

// Allow the API to receive JSON request bodies.
app.use(express.json());

// Return a clear error if a request contains invalid JSON.
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      error: "Invalid JSON request body"
    });
  }

  next(err);
});

/* ------------------------------------------------------------------
   Validation helpers ("Never trust the client")
   Syntactic validation: is the format correct?
   Semantic validation: is the value allowed?
------------------------------------------------------------------ */

// Maximum lengths match the columns in schema.sql.
const FIELD_LIMITS = {
  title: 100,
  category: 50,
  period: 60,
  location: 100,
  contributor: 70,
  description: 1000
};
const REFERENCE_LIMIT = 180;

// Categories offered by the Community Discoveries form.
const ALLOWED_CATEGORIES = [
  "Archaeology",
  "History",
  "Science",
  "Nature",
  "Invention",
  "Other"
];

// Standard UUID format used for discovery IDs.
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Demo marketplace products (used by the products and orders routes).
const marketplaceProducts = [
  { id: "greek-oinochoe", name: "Ancient Greek Oinochoe", category: "History", price: 85 },
  { id: "greek-krater", name: "Greek Terracotta Calyx-Krater", category: "Art", price: 120 },
  { id: "archaic-oinochoe", name: "Archaic Greek Oinochoe", category: "History", price: 95 },
  { id: "terracotta-vessel", name: "Terracotta Vessel Study", category: "History", price: 75 },
  { id: "egyptian-bronze", name: "Egyptian Bronze Statuette", category: "History", price: 110 },
  { id: "ancient-bronze-figure", name: "Ancient Bronze Figure", category: "Art", price: 95 }
];

// Check and clean the body of a discovery request.
// Returns { value } when valid, or { error } when invalid.
function validateDiscovery(body) {
  const input = body || {};
  const value = {};

  for (const [key, limit] of Object.entries(FIELD_LIMITS)) {
    const field = input[key];

    if (typeof field !== "string" || !field.trim()) {
      return { error: `"${key}" is required.` };
    }

    if (field.trim().length > limit) {
      return { error: `"${key}" must be ${limit} characters or fewer.` };
    }

    value[key] = field.trim();
  }

  if (!ALLOWED_CATEGORIES.includes(value.category)) {
    return {
      error: `"category" must be one of: ${ALLOWED_CATEGORIES.join(", ")}.`
    };
  }

  // The reference is optional, but it must be a string within the limit.
  if (input.reference !== undefined && input.reference !== null) {
    if (typeof input.reference !== "string") {
      return { error: `"reference" must be text.` };
    }

    if (input.reference.trim().length > REFERENCE_LIMIT) {
      return {
        error: `"reference" must be ${REFERENCE_LIMIT} characters or fewer.`
      };
    }
  }

  value.reference = (input.reference || "").trim();

  return { value };
}

// Check that a discovery ID has the correct UUID format.
function isValidDiscoveryId(id) {
  return typeof id === "string" && UUID_PATTERN.test(id);
}

/* ------------------------------------------------------------------
   Routes
------------------------------------------------------------------ */

// Check whether the backend is responding.
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Return all museum exhibits.
app.get("/api/exhibits", (req, res) => {
  res.status(200).json(exhibits);
});

// Return the timeline data.
app.get("/api/timeline", (req, res) => {
  res.status(200).json(timeline);
});

// Return the demo products displayed in the marketplace.
app.get("/api/marketplace", (req, res) => {
  res.status(200).json(marketplaceProducts);
});

// Validate the demo order request and return a confirmation.
// Orders are not saved to MySQL by this route.
app.post("/api/orders", (req, res) => {
  const { name, items } = req.body || {};

  if (typeof name !== "string" || !name.trim() || name.trim().length > 100) {
    return res.status(400).json({
      error: "A customer name of 1 to 100 characters is required."
    });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      error: "At least one cart item is required."
    });
  }

  const validItems = items.every(item =>
    item &&
    typeof item.id === "string" &&
    marketplaceProducts.some(product => product.id === item.id) &&
    Number.isInteger(item.quantity) &&
    item.quantity >= 1 &&
    item.quantity <= 1000
  );

  if (!validItems) {
    return res.status(400).json({
      error: "Each cart item needs a valid product id and a whole-number quantity from 1 to 1000."
    });
  }

  res.status(201).json({
    message: "Demo order confirmed.",
    customer: name.trim()
  });
});

// Return quiz questions without revealing the answers beforehand.
app.get("/api/quiz", (req, res) => {
  const questions = quizQuestions.map(
    ({ answer, explanation, ...question }) => question
  );

  res.status(200).json(questions);
});

// Submit an answer to a quiz question (a quiz answer is the resource).
app.post("/api/quiz/answers", (req, res) => {
  const { questionId, selectedAnswer } = req.body || {};

  const question = quizQuestions.find(q => q.id === questionId);

  if (!question) {
    return res.status(404).json({ error: "Question not found" });
  }

  if (
    !Number.isInteger(selectedAnswer) ||
    selectedAnswer < 0 ||
    selectedAnswer >= question.options.length
  ) {
    return res.status(400).json({ error: "Invalid answer" });
  }

  res.status(200).json({
    correct: selectedAnswer === question.answer,
    correctAnswer: question.answer,
    explanation: question.explanation
  });
});

// Return one exhibit using its ID.
app.get("/api/exhibits/:id", (req, res) => {
  const exhibit = exhibits.find(item => item.id === req.params.id);

  if (!exhibit) {
    return res.status(404).json({
      error: "Exhibit not found"
    });
  }

  res.status(200).json(exhibit);
});

// Retrieve community discoveries from MySQL.
app.get("/api/discoveries", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        title,
        category,
        period,
        location,
        contributor,
        description,
        \`reference\`,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM community_discoveries
      ORDER BY created_at DESC
    `);

    // Format the database records for the frontend response.
    const discoveries = rows.map(row => {
      const discovery = {
        id: row.id,
        title: row.title,
        category: row.category,
        period: row.period,
        location: row.location,
        contributor: row.contributor,
        description: row.description,
        reference: row.reference,
        createdAt: row.createdAt.toISOString()
      };

      if (row.updatedAt) {
        discovery.updatedAt = row.updatedAt.toISOString();
      }

      return discovery;
    });

    res.status(200).json(discoveries);
  } catch (error) {
    console.error("Failed to fetch discoveries:", error.message);

    res.status(500).json({
      error: "Failed to retrieve discoveries."
    });
  }
});

// Create a new community discovery after validating the submitted details.
app.post("/api/discoveries", async (req, res) => {
  const { value, error } = validateDiscovery(req.body);

  if (error) {
    return res.status(400).json({ error });
  }

  // Prepare the discovery record before saving it.
  const discovery = { id: crypto.randomUUID(), ...value };

  try {
    // Save the new discovery using a parameterized MySQL query.
    const [result] = await db.execute(
      `INSERT INTO community_discoveries
       (id, title, category, period, location, contributor, description, \`reference\`)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        discovery.id,
        discovery.title,
        discovery.category,
        discovery.period,
        discovery.location,
        discovery.contributor,
        discovery.description,
        discovery.reference
      ]
    );

    // Retrieve the creation timestamp recorded by MySQL.
    const [rows] = await db.execute(
      `SELECT created_at
       FROM community_discoveries
       WHERE id = ?`,
      [discovery.id]
    );

    if (result.affectedRows !== 1 || !rows.length) {
      return res.status(500).json({
        error: "Failed to save discovery."
      });
    }

    discovery.createdAt = rows[0].created_at.toISOString();

    return res.status(201).json(discovery);
  } catch (dbError) {
    console.error("Failed to save discovery:", dbError.message);

    return res.status(500).json({
      error: "Failed to save discovery."
    });
  }
});

// Update an existing community discovery.
app.put("/api/discoveries/:id", async (req, res) => {
  if (!isValidDiscoveryId(req.params.id)) {
    return res.status(400).json({ error: "Invalid discovery ID." });
  }

  const { value, error } = validateDiscovery(req.body);

  if (error) {
    return res.status(400).json({ error });
  }

  try {
    // Confirm that the requested discovery exists.
    const [existing] = await db.execute(
      "SELECT id FROM community_discoveries WHERE id = ?",
      [req.params.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        error: "Discovery not found"
      });
    }

    // Update the record and its last-modified timestamp.
    await db.execute(
      `UPDATE community_discoveries
       SET title = ?,
           category = ?,
           period = ?,
           location = ?,
           contributor = ?,
           description = ?,
           \`reference\` = ?,
           updated_at = CURRENT_TIMESTAMP(3)
       WHERE id = ?`,
      [
        value.title,
        value.category,
        value.period,
        value.location,
        value.contributor,
        value.description,
        value.reference,
        req.params.id
      ]
    );

    // Retrieve the updated record to return the saved values.
    const [rows] = await db.execute(
      `SELECT id, title, category, period, location,
              contributor, description, \`reference\`,
              created_at, updated_at
       FROM community_discoveries
       WHERE id = ?`,
      [req.params.id]
    );

    const row = rows[0];

    return res.status(200).json({
      id: row.id,
      title: row.title,
      category: row.category,
      period: row.period,
      location: row.location,
      contributor: row.contributor,
      description: row.description,
      reference: row.reference,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString()
    });
  } catch (dbError) {
    console.error("Failed to update discovery:", dbError.message);

    return res.status(500).json({
      error: "Failed to update discovery."
    });
  }
});

// Delete a discovery from MySQL using its ID.
app.delete("/api/discoveries/:id", async (req, res) => {
  if (!isValidDiscoveryId(req.params.id)) {
    return res.status(400).json({ error: "Invalid discovery ID." });
  }

  try {
    const [result] = await db.execute(
      "DELETE FROM community_discoveries WHERE id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Discovery not found"
      });
    }

    // 204 No Content: the record was removed and there is nothing to return.
    return res.status(204).end();
  } catch (dbError) {
    console.error("Failed to delete discovery:", dbError.message);

    return res.status(500).json({
      error: "Failed to delete discovery."
    });
  }
});

// Return a 404 response for API endpoints that do not exist.
app.use("/api", (req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// Prevent direct requests to the backend folder path.
app.use("/backend", (req, res) => {
  res.sendStatus(404);
});

// Locate the project root for serving the frontend files.
const frontendPath = path.resolve(__dirname, "..");

// Serve the website's home page.
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Serve the community discoveries page.
app.get("/community-discoveries.html", (req, res) => {
  res.sendFile(path.join(frontendPath, "community-discoveries.html"));
});

// Serve the remaining static frontend files.
app.use(express.static(frontendPath));

// Final safety net: unexpected errors return a JSON 500 instead of a stack trace.
app.use((err, req, res, next) => {
  console.error("Unexpected error:", err.message);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({ error: "Internal server error" });
});

// Start the backend server.
const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Handle server startup errors, including a port that is already in use.
server.on("error", (error) => {
  console.error(`Server startup failed: ${error.message}`);
  process.exitCode = 1;
});