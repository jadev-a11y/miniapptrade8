import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Debug: Check where we are and what files exist
console.log('Current directory:', process.cwd());
console.log('__dirname:', __dirname);
console.log('Files in current dir:', fs.readdirSync('.'));
console.log('Does ./dist exist?', fs.existsSync('./dist'));
if (fs.existsSync('./dist')) {
  console.log('Files in ./dist:', fs.readdirSync('./dist'));
}

// Serve static files with forced MIME types
app.use('/dist', express.static('./dist', {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    }
  }
}));

app.use(express.static('./', {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    }
  }
}));

// API endpoint для получения ключа
app.get('/api/config', (req, res) => {
  res.json({
    OPENAI_API_KEY: process.env.OPENAI_API_KEY
  });
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  const indexPath = path.join(process.cwd(), 'index.html');
  console.log('Trying to serve:', indexPath);
  console.log('File exists?', fs.existsSync(indexPath));
  res.sendFile(indexPath);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});