const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const compression = require('compression');

const app = express();
const PORT = 3001;

app.use(compression({
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
        if (req.headers['accept-encoding'] && req.headers['accept-encoding'].includes('gzip')) {
            return compression.filter(req, res);
        }
        return false;
    }
}));

app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001', 'http://127.0.0.1:3001', 'http://localhost:3002', 'http://127.0.0.1:3002'],
    credentials: true
}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
    }

    next();
});

app.use(express.static(__dirname, {
    maxAge: '1d',
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Cache-Control', 'public, max-age=86400');
        } else if (path.endsWith('.js')) {
            res.setHeader('Cache-Control', 'public, max-age=86400');
        } else if (path.endsWith('.html')) {
            res.setHeader('Cache-Control', 'public, max-age=3600');
        }
    }
}));

app.use('/Naats', express.static(path.join(__dirname, 'Naats'), {
    maxAge: '7d',
    setHeaders: (res, path) => {
        if (path.endsWith('.png') || path.endsWith('.jpg') || path.endsWith('.jpeg')) {
            res.setHeader('Cache-Control', 'public, max-age=604800');
            res.setHeader('Content-Type', 'image/png');
        } else if (path.endsWith('.mp3')) {
            res.setHeader('Cache-Control', 'public, max-age=604800');
            res.setHeader('Accept-Ranges', 'bytes');
        }
    }
}));

app.get('/api/folders', (req, res) => {
    const naatsPath = path.join(__dirname, 'Naats');

    try {
        const items = fs.readdirSync(naatsPath, { withFileTypes: true });
        const folders = [];

        const rootMp3Files = items
            .filter(item => item.isFile() && item.name.endsWith('.mp3'))
            .map(file => file.name);

        if (rootMp3Files.length > 0) {
            folders.push({
                name: 'All Naats',
                path: '',
                count: rootMp3Files.length,
                files: rootMp3Files
            });
        }

        const subfolders = items.filter(item => item.isDirectory());

        for (const folder of subfolders) {
            const folderPath = path.join(naatsPath, folder.name);
            const folderItems = fs.readdirSync(folderPath);
            const mp3Files = folderItems.filter(file => file.endsWith('.mp3'));
            const imgFile = folderItems.find(file => file.toLowerCase() === folder.name.toLowerCase() + '.png') ||
                           folderItems.find(file => file.endsWith('.png'));
            const img = imgFile ? `Naats/${folder.name}/${imgFile}` : 'Naatify_logo.png';

            if (mp3Files.length > 0) {
                folders.push({
                    name: folder.name,
                    path: folder.name,
                    count: mp3Files.length,
                    files: mp3Files,
                    img: img
                });
            }
        }

        res.json(folders);
    } catch (error) {
        console.error('Error reading Naats folder:', error);
        res.status(500).json({ error: 'Failed to read Naats folder' });
    }
});

app.get('/api/files/:folder?', (req, res) => {
    const folderName = req.params.folder || '';
    const naatsPath = folderName
        ? path.join(__dirname, 'Naats', folderName)
        : path.join(__dirname, 'Naats');

    try {
        const items = fs.readdirSync(naatsPath);
        const mp3Files = items
            .filter(file => file.endsWith('.mp3'))
            .map(file => {
                const relativePath = folderName
                    ? `Naats/${folderName}/${file}`
                    : `Naats/${file}`;
                return {
                    name: file,
                    url: `http://localhost:${PORT}/${relativePath}`
                };
            });

        res.json(mp3Files);
    } catch (error) {
        console.error('Error reading folder:', error);
        res.status(500).json({ error: 'Failed to read folder' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Naats folder: ${path.join(__dirname, 'Naats')}`);
});
