import * as fs from "node:fs";
import * as path from "node:path";
import * as util from "node:util";

const { values } = util.parseArgs({
  options: {
    "target-folder": { type: "string", short: "t" },
    "artist-regex": { type: "string", short: "r" },
    space: { type: "string", short: "s" },
  },
});
if (!values["target-folder"] || !values["artist-regex"] || !values.space) {
  console.error(`Usage:`);
  console.error(
    `node cli.js --target-folder /path/to/parent/folder --artist-regex "parent/folder/(.+?)/" --space 5 > list.m3u8`,
  );
  process.exit(0);
}
const targetFolder = String(values["target-folder"]);
const artistRegex = String(values["artist-regex"]);
const space = Number(values.space);
const filePaths = fs.readdirSync(targetFolder, {
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
    const artist = new RegExp(artistRegex).exec(fullPath)?.at(1);
    if (artist) {
      return { path: fullPath, artist };
    } else {
      throw new Error(`Cannot find artist for path ${fullPath}.`);
    }
  });
const shuffled = songs
  .map((song) => ({ song, rank: Math.random() }))
  .sort((a, b) => a.rank - b.rank)
  .map(({ song }) => song);
console.error(`Shuffling ${shuffled.length} songs.`);
const spaceShuffled: string[] = [];
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
