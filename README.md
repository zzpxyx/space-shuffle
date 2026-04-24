# Space Shuffle

Shuffle music files with spacing between the same artist.

## Build and Run

```
npm install
npx tsc
node cli.js --target-folder /path/to/parent/folder --regex "parent/folder/(?<artist>.+?)/.+?(\.mp3|\.m4a)$" --space 5 > list.m3u8
```

CLI parameters:

- `target-folder`: The parent folder that contains the music files.
- `regex`: The regular expression to filter the files to shuffle as well as to specify how to get the artist information from the path. The matched artist string should be in a named capture group `artist`.
- `space`: Minimum number of songs between two songs that are from the same artist.
