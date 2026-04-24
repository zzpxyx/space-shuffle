# Space Shuffle

Shuffle music files with spacing between the same artist. This is to quickly make a playlist that sounds like the radio without ads.

Technically, this script can be used on any type of files. The `artist` information is just for spacing files within the same group. Maybe shuffle some photo albums for a digital picture frame?

## Algorithm

Currently, the script uses a very naive and lossy algorithm:

1. Shuffle all regex-matched music files and make a list.
2. Scan the list. If a music file has the same artist within the past `space` number of files, discard it and move on to the next file.
3. Output the paths for the remaining files.

## Build and Run

```
npm install
npx tsc
node cli.js --target-folder /path/to/parent/folder --regex "parent/folder/(?<artist>.+?)/.+?(\.mp3|\.m4a)$" --space 5 > list.m3u8
```

CLI parameters:

- `target-folder`: The parent folder that contains the music files.
- `regex`: The regular expression to filter the files to shuffle as well as to specify how to get the artist information from the path. The matched artist string should be in a named capture group `artist`.
- `space`: Minimum number of music files between two files that are from the same artist.
