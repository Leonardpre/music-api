// const fs = require('fs');
// const path = require('path');
// const file = path.join(process.cwd(), 'songs.js');
// let text = fs.readFileSync(file, 'utf8');
// const regex = /\{\s*id:\s*(\d+),\s*title:\s*"([^\"]+)",\s*artist:\s*"([^\"]+)",\s*album:\s*"([^\"]+)",\s*duration:\s*"([^\"]+)",\s*genre:\s*"([^\"]+)"\s*\},/g;
// let count = 0;
// text = text.replace(regex, (match, id, title, artist, album, duration, genre) => {
//   count += 1;
//   const query = 'https://open.spotify.com/search/' + artist + ' ' + title;
//   const audio = 'https://www.google.com/search?q=' + encodeURIComponent(query).replace(/%20/g, '%2520');
//   return `{ id: ${id}, title: "${title}", artist: "${artist}", album: "${album}", duration: "${duration}", genre: "${genre}", audio: "${audio}" },`;
// });
// if (count === 0) {
//   throw new Error('No song entries found to update.');
// }
// fs.writeFileSync(file, text, 'utf8');
// console.log(`Updated ${count} song entries with audio links.`);
