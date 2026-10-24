const express = require("express");
const path = require("node:path");
const exhibits = require("./data/exhibits");
const fs = require("node:fs");
const vm = require("node:vm");
const context = { window: {} };

const source = fs.readFileSync(
  path.join(__dirname, "../js/data.js"),
  "utf8"
);

vm.runInNewContext(source, context);

const timeline = context.window.CURIO_DATA.timeline;
const quizQuestions = context.window.CURIO_DATA.quizQuestions;

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      error: "Invalid JSON request body"
    });
  }

  next(err);
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
app.get("/api/exhibits", (req, res) => {
  res.status(200).json(exhibits);
});
app.get("/api/timeline", (req, res) => {
  res.status(200).json(timeline);
});

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
const demoOrders = [];
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

app.get("/api/quiz", (req, res) => {
    const questions = quizQuestions.map(({ answer, explanation, ...question }) => question);

    res.status(200).json(questions);
});

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
app.get("/api/exhibits/:id", (req, res) => {
  const exhibit = exhibits.find(item => item.id === req.params.id);

  if (!exhibit) {
    return res.status(404).json({
      error: "Exhibit not found"
    });
  }

  res.status(200).json(exhibit);
});

const discoveries = [];
app.get("/api/discoveries", (req, res) => {
  res.status(200).json(discoveries);
});

app.post("/api/discoveries", (req, res) => {
  const { title, category, period, location, contributor, description, reference } = req.body || {};

  const requiredFields = { title, category, period, location, contributor, description };

  const invalid = Object.values(requiredFields).some(
    value => typeof value !== "string" || !value.trim()
  );

  if (invalid || (reference !== undefined && typeof reference !== "string")) {
    return res.status(400).json({
      error: "Please provide valid discovery details."
    });
  }

  const discovery = {
    id: require("node:crypto").randomUUID(),
    title: title.trim(),
    category: category.trim(),
    period: period.trim(),
    location: location.trim(),
    contributor: contributor.trim(),
    description: description.trim(),
    reference: (reference || "").trim(),
    createdAt: new Date().toISOString()
  };

  discoveries.unshift(discovery);

  res.status(201).json(discovery);
});
app.post("/api/discoveries/:id/edit", (req, res) => {
  const discovery = discoveries.find(item => item.id === req.params.id);

  if (!discovery) {
    return res.status(404).json({ error: "Discovery not found" });
  }

  const { title, category, period, location, contributor, description, reference } = req.body || {};

  const requiredFields = { title, category, period, location, contributor, description };

  const invalid = Object.values(requiredFields).some(
    value => typeof value !== "string" || !value.trim()
  );

  if (invalid || (reference !== undefined && typeof reference !== "string")) {
    return res.status(400).json({
      error: "Please provide valid discovery details."
    });
  }

  Object.assign(discovery, {
    title: title.trim(),
    category: category.trim(),
    period: period.trim(),
    location: location.trim(),
    contributor: contributor.trim(),
    description: description.trim(),
    reference: (reference || "").trim(),
    updatedAt: new Date().toISOString()
  });

  res.status(200).json(discovery);
});
app.post("/api/discoveries/:id/delete", (req, res) => {
  const index = discoveries.findIndex(
    item => item.id === req.params.id
  );

  if (index === -1) {
    return res.status(404).json({
      error: "Discovery not found"
    });
  }

  discoveries.splice(index, 1);

  res.status(200).json({
    message: "Discovery deleted successfully"
  });
});

app.use("/api", (req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

app.use("/backend", (req, res) => {
  res.sendStatus(404);
});

const frontendPath = path.resolve(__dirname, "..");

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.get("/community-discoveries.html", (req, res) => {
  res.sendFile(path.join(frontendPath, "community-discoveries.html"));
});

app.use(express.static(frontendPath));

const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

server.on("error", (error) => {
  console.error(`Server startup failed: ${error.message}`);
  process.exitCode = 1;
});