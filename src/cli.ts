import * as fs from "node:fs";
import * as path from "node:path";
import * as util from "node:util";

const { values } = util.parseArgs({
  options: {
    "target-folder": { type: "string", short: "t" },
    regex: { type: "string", short: "r" },
    space: { type: "string", short: "s" },
  },
});
if (!values["target-folder"] || !values.regex || !values.space) {
  console.error(`Usage:`);
  console.error(
    String.raw`node cli.js --target-folder /path/to/parent/folder ` +
      String.raw`--regex "parent/folder/(?<artist>.+?)/.+?(\.mp3|\.m4a)$" --space 5 > list.m3u8`,
  );
  process.exit(0);
}
const targetFolder = String(values["target-folder"]);
const regex = String(values.regex);
const space = Number(values.space);
const filePaths = fs.readdirSync(targetFolder, {
  recursive: true,
  withFileTypes: true,
});
const files = filePaths
  .map((entry) => {
    const fullPath = path.join(entry.parentPath, entry.name);
    const artist = new RegExp(regex).exec(fullPath)?.groups?.artist;
    if (artist) {
      return { path: fullPath, artist };
    } else {
      return null;
    }
  })
  .filter((entry) => entry !== null);
const shuffled = files
  .map((file) => ({ file, rank: Math.random() }))
  .sort((a, b) => a.rank - b.rank)
  .map(({ file }) => file);
console.error(`Shuffling ${shuffled.length} files.`);
const spaceShuffled: string[] = [];
const restricted: string[] = [];
for (const file of shuffled) {
  if (!restricted.includes(file.artist)) {
    spaceShuffled.push(file.path);
    restricted.push(file.artist);
    if (restricted.length > space) {
      restricted.shift();
    }
  }
}
console.error(`${spaceShuffled.length} files left.`);
spaceShuffled.forEach((file) => console.log(file));
