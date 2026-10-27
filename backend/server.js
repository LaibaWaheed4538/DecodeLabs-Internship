// Load the packages needed to run the backend server.
const express = require("express");
const path = require("node:path");

// Load environment variables from the backend .env file.
const process = require("node:process");

process.loadEnvFile(path.join(__dirname, ".env"));

// Use the promise-based MySQL driver for database queries.
const mysql = require("mysql2/promise");

// Create a connection pool using the database settings from .env.
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Load the existing exhibit data.
const exhibits = require("./data/exhibits");
const fs = require("node:fs");
const vm = require("node:vm");
const context = { window: {} };

// Read the shared data file used by the frontend.
const source = fs.readFileSync(
  path.join(__dirname, "../js/data.js"),
  "utf8"
);

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
    res.status(200).json([
        { id: "greek-oinochoe", name: "Ancient Greek Oinochoe", category: "History", price: 85 },
        { id: "greek-krater", name: "Greek Terracotta Calyx-Krater", category: "Art", price: 120 },
        { id: "archaic-oinochoe", name: "Archaic Greek Oinochoe", category: "History", price: 95 },
        { id: "terracotta-vessel", name: "Terracotta Vessel Study", category: "History", price: 75 },
        { id: "egyptian-bronze", name: "Egyptian Bronze Statuette", category: "History", price: 110 },
        { id: "ancient-bronze-figure", name: "Ancient Bronze Figure", category: "Art", price: 95 }
    ]);
});

// Keep the existing demo order functionality.
const demoOrders = [];

// Validate the demo order request and return a confirmation.
// Orders are not saved to MySQL by this route.
app.post("/api/orders", (req, res) => {
    const { name, items } = req.body || {};

    if (typeof name !== "string" || !name.trim() ||
        !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
            error: "Valid customer name and cart items are required."
        });
    }

    res.status(201).json({
        message: "Demo order confirmed.",
        customer: name.trim()
    });
});

// Return quiz questions without revealing the answers beforehand.
app.get("/api/quiz", (req, res) => {
    const questions = quizQuestions.map(({ answer, explanation, ...question }) => question);

    res.status(200).json(questions);
});

// Check an answer submitted for a quiz question.
app.post("/api/quiz/check", (req, res) => {
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
  const {
    title,
    category,
    period,
    location,
    contributor,
    description,
    reference
  } = req.body || {};

  // List the fields that must be provided.
  const requiredFields = {
    title,
    category,
    period,
    location,
    contributor,
    description
  };

const fieldLimits = {
  title: 100,
  category: 50,
  period: 60,
  location: 100,
  contributor: 70,
  description: 1000
};

// Check that required fields are valid and within their length limits.
const invalid = Object.entries(requiredFields).some(
  ([key, value]) =>
    typeof value !== "string" ||
    !value.trim() ||
    value.trim().length > fieldLimits[key]
);

// The reference is optional, but it must be a string within the allowed length.
const invalidReference =
  reference !== undefined &&
  (typeof reference !== "string" || reference.trim().length > 180);

if (invalid || invalidReference) {
    return res.status(400).json({
      error: "Please provide valid discovery details."
    });
  }

  // Prepare the discovery record before saving it.
  const discovery = {
    id: require("node:crypto").randomUUID(),
    title: title.trim(),
    category: category.trim(),
    period: period.trim(),
    location: location.trim(),
    contributor: contributor.trim(),
    description: description.trim(),
    reference: (reference || "").trim()
  };

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
  } catch (error) {
    console.error("Failed to save discovery:", error.message);

    return res.status(500).json({
      error: "Failed to save discovery."
    });
  }
});


// Update an existing community discovery.
app.put("/api/discoveries/:id", async (req, res) => {
  const {
    title,
    category,
    period,
    location,
    contributor,
    description,
    reference
  } = req.body || {};

  const requiredFields = {
    title,
    category,
    period,
    location,
    contributor,
    description
  };

// Keep the input length limits consistent with the database columns.
  const fieldLimits = {
  title: 100,
  category: 50,
  period: 60,
  location: 100,
  contributor: 70,
  description: 1000
};

// Check the required fields and their maximum lengths.
const invalid = Object.entries(requiredFields).some(
  ([key, value]) =>
    typeof value !== "string" ||
    !value.trim() ||
    value.trim().length > fieldLimits[key]
);

// Check the optional reference field.
const invalidReference =
  reference !== undefined &&
  (typeof reference !== "string" || reference.trim().length > 180);
  if (invalid || invalidReference) {
    return res.status(400).json({
      error: "Please provide valid discovery details."
    });
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
        title.trim(),
        category.trim(),
        period.trim(),
        location.trim(),
        contributor.trim(),
        description.trim(),
        (reference || "").trim(),
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

    const discovery = {
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
    };

    return res.status(200).json(discovery);
  } catch (error) {
    console.error("Failed to update discovery:", error.message);

    return res.status(500).json({
      error: "Failed to update discovery."
    });
  }
});


// Delete a discovery from MySQL using its ID.
app.delete("/api/discoveries/:id", async (req, res) => {
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

    return res.status(200).json({
      message: "Discovery deleted successfully"
    });
  } catch (error) {
    console.error("Failed to delete discovery:", error.message);

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

// Start the backend server.
const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Handle server startup errors, including a port that is already in use.
server.on("error", (error) => {
  console.error(`Server startup failed: ${error.message}`);
  process.exitCode = 1;
});