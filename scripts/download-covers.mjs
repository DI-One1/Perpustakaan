import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import http from 'node:http';

const coversToDownload = [
  {
    filename: 'cover-clean-architecture.jpg',
    url: 'https://covers.openlibrary.org/b/isbn/9780134494166-L.jpg',
    source: 'Open Library (ISBN: 9780134494166, Prentice Hall)'
  },
  {
    filename: 'cover-computer-networks.jpg',
    url: 'https://covers.openlibrary.org/b/isbn/9780133594140-L.jpg',
    source: 'Open Library (ISBN: 9780133594140, Pearson Education)'
  },
  {
    filename: 'cover-programming-typescript.jpg',
    url: 'https://covers.openlibrary.org/b/isbn/9781492052203-L.jpg',
    source: 'Open Library (ISBN: 9781492052203, O\'Reilly Media)'
  },
  {
    filename: 'cover-riyadhus-shalihin.jpg',
    url: 'https://covers.openlibrary.org/b/id/4459641-L.jpg',
    source: 'Open Library (ID: 4459641, Imam An-Nawawi)'
  },
  {
    filename: 'cover-postgresql.jpg',
    url: 'https://covers.openlibrary.org/b/isbn/9781491963418-L.jpg',
    source: 'Open Library (ISBN: 9781491963418, O\'Reilly Media)'
  },
  {
    filename: 'cover-atomic-habits.jpg',
    url: 'https://cdn.gramedia.com/uploads/products/all10sara3.jpg',
    source: 'Gramedia (ISBN: 9786020633176, Gramedia Pustaka Utama)'
  },
  {
    filename: 'cover-algorithms-cormen.jpg',
    url: 'https://covers.openlibrary.org/b/isbn/9780262046305-L.jpg',
    source: 'Open Library (ISBN: 9780262046305, MIT Press)'
  },
  {
    filename: 'cover-mikrotik-security.jpg',
    url: 'https://covers.openlibrary.org/b/id/10401457-L.jpg',
    source: 'Open Library (ID: 10401457, Tyler Hart)'
  },
  {
    filename: 'cover-laskar-pelangi.jpg',
    url: 'https://cdn.gramedia.com/uploads/items/9789793062792_New-Edition-Laskar-Pelangi.jpg',
    source: 'Gramedia (ISBN: 9789793062792, Bentang Pustaka)'
  }
];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    function get(currentUrl, redirectCount = 0) {
      if (redirectCount > 5) return reject(new Error('Too many redirects: ' + currentUrl));
      const client = currentUrl.startsWith('https') ? https : http;
      client.get(currentUrl, { headers: { 'User-Agent': 'Mozilla/5.0 BILIK/1.0' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return get(res.headers.location, redirectCount + 1);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`Status ${res.statusCode} for ${currentUrl}`));
        }
        const file = fs.createWriteStream(destPath);
        res.pipe(file);
        file.on('finish', () => {
          file.close(() => resolve({ size: fs.statSync(destPath).size }));
        });
      }).on('error', reject);
    }
    get(url);
  });
}

const targetDir = path.resolve('frontend/public/images/covers');

console.log('Downloading authentic covers to:', targetDir);
for (const item of coversToDownload) {
  const dest = path.join(targetDir, item.filename);
  try {
    const res = await downloadFile(item.url, dest);
    console.log(`[OK] ${item.filename} (${res.size} bytes) from ${item.source}`);
  } catch (err) {
    console.error(`[FAIL] ${item.filename}:`, err.message);
  }
}
