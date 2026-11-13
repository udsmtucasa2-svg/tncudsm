// Pictures for the 28 Fundamental Beliefs (shown inside the blobs on the About page).
//
// How a picture is chosen for belief number N (tried in this order, first one that loads wins):
//   1. beliefImageUrls[N]          a link you set below (these always win)
//   2. public/beliefs/NN.webp      your own file, e.g. 01.webp (made by `npm run images:beliefs`)
//   3. public/beliefs/NN.jpg       your own file, e.g. 01.jpg
//   4. a temporary picture found by keyword (placeholderKeywords below)
//   5. the group icon              if nothing above loads
//
// To change one picture later: put a link in beliefImageUrls, or drop your own file in public/beliefs/.
const u = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&h=600&q=75`;

export const beliefImageUrls = {
  // Free to use under the Unsplash License. Ids were read from the photo pages.
  1: u('photo-1469228252629-cbe7cb7db2c8'),  // Holy Scriptures: opened Bible (Aaron Burden)
  2: 'https://i.pinimg.com/1200x/26/66/a5/2666a56dc4173ca9ae56ee169dabf728.jpg',
   4: 'https://i.pinimg.com/736x/ee/0e/99/ee0e99c0839b3868f5de6658ec0d18ba.jpg',
   5: 'https://i.pinimg.com/736x/cb/ce/2f/cbce2f95c0049d3f821091cc8b402187.jpg',
   6: 'https://i.pinimg.com/1200x/a0/b5/f1/a0b5f11a920da640df9f3142c8a19f43.jpg',
   7: '',
   8: 'https://i.pinimg.com/1200x/1f/2b/fc/1f2bfc51b9432588754e90c0f5e4b95a.jpg',
   9: 'https://i.pinimg.com/1200x/f5/99/e9/f599e922efbda50739806a0cc5a796ad.jpg', 
   10: 'https://i.pinimg.com/736x/fe/35/ba/fe35ba7432865b608026eaf98c2a542d.jpg',
   11: 'https://i.pinimg.com/736x/f8/3c/07/f83c07addcabac3801cde6cdc04971f5.jpg',
   12: 'https://i.pinimg.com/1200x/fc/aa/b6/fcaab6cef95ed641bd585b3063507d8c.jpg', // Holy Scriptures: opened Bible (Aaron Burden)
  13: 'https://i.pinimg.com/736x/ec/5c/b5/ec5cb54931f84289eff5eae32c334906.jpg',
  14: 'https://i.pinimg.com/1200x/1e/50/0a/1e500a30cea7925a3a16728290781f85.jpg', 
  15: 'https://i.pinimg.com/736x/44/c0/8d/44c08ded6a76feee280ac72839554add.jpg',
   16: 'https://i.pinimg.com/736x/5e/63/7d/5e637d19d2842cb79b993364dc1fcc42.jpg',
   17: 'https://i.pinimg.com/736x/50/95/36/509536696a1ef5c8dcc7adeb005e16d0.jpg',
   18: 'https://i.pinimg.com/236x/7b/a2/5c/7ba25cbed5c1c32166261464c4004603.jpg',
19: 'https://i.pinimg.com/736x/6d/e4/e1/6de4e1534f18f6962a37e53277df4750.jpg',
20: 'https://i.pinimg.com/1200x/a5/cb/c4/a5cbc4a06106ef53ebb8226aed1f3e73.jpg',
21: 'https://i.pinimg.com/1200x/ad/89/74/ad89746f338690b64f3ede0b8c5b40a0.jpg',
22: 'https://i.pinimg.com/736x/4d/20/f1/4d20f1b543fa4dee31fc5a4baee42639.jpg',
23: 'https://i.pinimg.com/1200x/b4/f9/4d/b4f94d8da47286a8eaf2f270f67b6a2d.jpg',
24: 'https://i.pinimg.com/236x/74/12/a7/7412a7b42a86b9c70926d6d26a2355e8.jpg',
26: 'https://i.pinimg.com/1200x/93/8c/af/938caf34fda63ea144e232834aabb749.jpg',
27: 'https://i.pinimg.com/736x/9d/65/6b/9d656bdaa70b2c1a7eb5c40f1c1fb4dd.jpg',
28: 'https://i.pinimg.com/736x/58/cd/24/58cd24a06fcd6254327a13f834ee4c11.jpg',  3: u('photo-1780047053902-9bcf0f8af9fb'),  // God the Father: sun rays through clouds (Pascal Debrunner)
  25: u('photo-1507820371316-330690662126'), // Second Coming: sun rays over the sea (Chris Slupski)

  // Replace any belief with a better picture, e.g.  20: 'https://example.com/sabbath.jpg',
};

// TEMPORARY pictures so every blob has something while you collect your own.
// Served by loremflickr.com (random Flickr photos matching the keywords; "lock" keeps the same one each time).
// Flickr photos carry their own licences, so replace these with your own or Unsplash pictures before going live.
const placeholderKeywords = {
  2: 'candles,light', 4: 'cross,sunrise', 5: 'dove', 6: 'sunrise,landscape', 7: 'friends,community',
  8: 'lighthouse,storm', 9: 'cave,light', 10: 'hands,worship', 11: 'seedling,plant', 12: 'church',
  13: 'lantern', 14: 'hands,together', 15: 'baptism,river', 16: 'bread,wine', 17: 'choir,singing',
  18: 'candle,book', 19: 'stone,mountain', 20: 'sunset', 21: 'donation,hands', 22: 'fruits,vegetables',
  23: 'family', 24: 'stained,glass', 26: 'flowers,sunrise', 27: 'lake,calm', 28: 'garden,river',
};

const base = import.meta.env.BASE_URL;
const pad = (n) => String(n).padStart(2, '0');

export function beliefImageCandidates(n) {
  const kw = placeholderKeywords[n];
  return [
    beliefImageUrls[n],
    `${base}beliefs/${pad(n)}.webp`,
    `${base}beliefs/${pad(n)}.jpg`,
    kw && `https://loremflickr.com/600/600/${kw}?lock=${n}`,
  ].filter(Boolean);
}