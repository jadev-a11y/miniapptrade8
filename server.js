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

// Set proper MIME types
express.static.mime.define({
  'application/javascript': ['js'],
  'text/css': ['css']
});

// Serve static files from dist directory
app.use('/dist', express.static('./dist', {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

// Serve other static files from root
app.use(express.static('./', {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

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