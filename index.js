const http = require('http');
const https = require('https');
const { parse } = require('url');

const server = http.createServer((req, res) => {
  if (req.url === '/getTimeStories' && req.method === 'GET') {
    const url = 'https://time.com';
    
    https.get(url, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        const latestStories = extractLatestStories(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(latestStories, null, 2));
      });
    }).on('error', (error) => {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`Error: ${error.message}`);
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

function extractLatestStories(html) {
  const stories = [];
  let match;
  const storyRegex = /<li class="latest-stories__item">.*?<a href="(.*?)">\s*<h3 class="latest-stories__item-headline">(.*?)<\/h3>/gs;

  while ((match = storyRegex.exec(html)) !== null && stories.length < 6) {
    const link = match[1];
    const title = match[2];
    stories.push({ title, link });
  }

  return stories;
}
