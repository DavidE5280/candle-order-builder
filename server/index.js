import express from "express";
import cors from "cors";
import crypto from "crypto";

import { fragrances } from "./mockData/fragrances.js";

/**
 * This server is a simple Express API that manages a list of fragrances in memory.
 * It provides endpoints to get all fragrances, add a new fragrance, update an existing fragrance, and delete a fragrance.
 * The fragrance data is stored in an array called `fragranceStore`, which is initialized with some mock data.
 * Each fragrance has the following fields: `id`, `name`, `description`, `created_at`, and `updated_at`.
 * The API listens on port 3001 and uses CORS to allow cross-origin requests from the frontend.
 */

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let fragranceStore = [...fragrances];

app.get("/api/fragrances", (req, res) => {
  res.json(fragranceStore);
});

app.post("/api/fragrances", (req, res) => {
  const newFragrance = {
    id: crypto.randomUUID(),
    ...req.body,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  fragranceStore.push(newFragrance);
  res.status(201).json(newFragrance);
});

app.put("/api/fragrances/:id", (req, res) => {
  const { id } = req.params;
  const index = fragranceStore.findIndex((f) => f.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Fragrance not found" });
  }

  const existing = fragranceStore[index];

  const updatedFragrance = {
    ...existing,
    ...req.body,
    id: existing.id,
    created_at: existing.created_at,
    updated_at: new Date().toISOString(),
  };

  fragranceStore[index] = updatedFragrance;
  res.json(updatedFragrance.id);
});

app.delete("/api/fragrances/:id", (req, res) => {
  const { id } = req.params;
  const index = fragranceStore.findIndex((f) => f.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Fragrance not found" });
  }

  const deleted = fragranceStore[index];
  fragranceStore.splice(index, 1);

  res.json({
    message: `Fragrance ${id} deleted`,
    deleted,
  });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
