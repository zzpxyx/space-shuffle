import * as fs from "node:fs";
import * as path from "node:path";
import * as util from "node:util";

const getMetadata = (path: string): { artist: string } => {
  const artist = path.split("/")[0];
  if (artist === undefined) {
    throw new Error(`Invalid metadata for path ${path}.`);
  }
  return { artist };
};

const { values } = util.parseArgs({
  options: {
    "target-folder": { type: "string", short: "t" },
    space: { type: "string", short: "s" },
  },
});
const root = String(values["target-folder"]);
const space = Number(values.space);
const filePaths = fs.readdirSync(root, {
  recursive: true,
  withFileTypes: true,
});
const songs = filePaths
  .filter(
    (entry) =>
      entry.isFile() &&
      (entry.name.endsWith(".mp3") || entry.name.endsWith(".m4a")),
  )
  .map((entry) => {
    const fullPath = path.join(entry.parentPath, entry.name);
    const relativePath = path.relative(root, fullPath);
    return {
      path: fullPath,
      ...getMetadata(relativePath),
    };
  });
const shuffled = songs
  .map((song) => ({ song, rank: Math.random() }))
  .sort((a, b) => a.rank - b.rank)
  .map(({ song }) => song);
console.error(`Shuffling ${shuffled.length} songs.`);
const spaceShuffled = [];
const restricted: string[] = [];
for (const song of shuffled) {
  if (!restricted.includes(song.artist)) {
    spaceShuffled.push(song.path);
    restricted.push(song.artist);
    if (restricted.length > space) {
      restricted.shift();
    }
  }
}
console.error(`${spaceShuffled.length} songs left.`);
spaceShuffled.forEach((song) => console.log(song));
