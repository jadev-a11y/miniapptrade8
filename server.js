import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Static files path - dist is in current directory on Render
const distPath = './dist';
console.log('Looking for dist at:', distPath);

// Serve static files from the dist directory
app.use(express.static(distPath));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve('./dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});