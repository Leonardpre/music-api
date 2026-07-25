const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const port = 5501;

// CORS headers for Vite dev server if running separately
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Check if client production dist exists, else fallback to public
const clientDistPath = path.join(__dirname, "client", "dist");
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
} else {
  app.use(express.static(path.join(__dirname, "public")));
}

function getSongs() {
  delete require.cache[require.resolve("./songs")];
  return require("./songs");
}

app.get("/songs", (req, res) => {
  res.json(getSongs());
});

app.get("/songs/:id", (req, res) => {
  const songsList = getSongs();
  const songId = parseInt(req.params.id);
  const song = songsList.find(s => s.id === songId);

  if (!song) {
    return res.status(404).json({ message: "Song not found" });
  }

  res.json(song);
});

// Fallback for SPA routing in Express 5
app.use((req, res) => {
  if (fs.existsSync(path.join(clientDistPath, "index.html"))) {
    res.sendFile(path.join(clientDistPath, "index.html"));
  } else {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  }
});

app.listen(port, () => {
  console.log(`Editorial Music Server is running on http://localhost:${port}`);
});