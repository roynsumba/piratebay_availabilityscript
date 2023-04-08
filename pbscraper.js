const express = require("express");
const TorrentSearchApi = require("torrent-search-api");
const app = express();
const port = process.env.PORT || 3000;

// Enable The Pirate Bay provider
TorrentSearchApi.enableProvider("ThePirateBay");

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/search", async (req, res) => {
  const query = req.body.query;

  try {
    const torrents = await TorrentSearchApi.search(query, "All", 10);

    const filteredTorrents = torrents.filter((torrent) => {
      const title = torrent.title.toLowerCase();
      return (
        (title.includes("web") || title.includes("h264")) &&
        !title.includes("hdtv") &&
        title.includes("1080p")
      );
    });

    if (filteredTorrents.length === 0) {
      res.render("results", {
        torrents: null,
        message: "No desired torrents yet.",
      });
    } else {
      res.render("results", { torrents: filteredTorrents, message: null });
    }
  } catch (err) {
    console.error(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong.");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
