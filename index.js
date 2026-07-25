const express = require("express");
const path = require("path");
const app = express();
const port = 5501;
const songs = require("./songs");

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});