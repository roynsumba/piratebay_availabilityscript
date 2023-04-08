const TorrentSearchApi = require("torrent-search-api");
const readline = require("readline");

// Enable The Pirate Bay provider
TorrentSearchApi.enableProvider("ThePirateBay");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function searchTorrents(query) {
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

    console.log(filteredTorrents);
  } catch (err) {
    console.error(err);
  }
}

rl.question("Enter the movie title: ", (movieTitle) => {
  searchTorrents(movieTitle);
  rl.close();
});
