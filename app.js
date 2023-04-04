/*
const http = require('http')
const fs = require('fs')
const path = require('path')
const host = '127.0.0.1'
const port = 7000
const express = require('express')
const app = express()

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url)
    const ext = path.extname(filePath)
    let contentType = 'text/html'

    switch (ext) {
    case '.css':
        contentType = 'text/css'
        break
    case '.js':
        contentType = 'text/javascript'
        break
    case '.svg':
        contentType = 'image/svg+xm'
        break
    case '.woff':
        contentType = 'application/x-font-ttf'
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(404)
                res.end('File not found')
            } else {
                res.writeHead(200, {
                    'Content-Type': contentType
                })
                res.end(content)
            }
        })
        break;
    default:
        contentType = 'text/html'
    }

    if (!ext) {
    filePath += '.html'
}


fs.readFile(filePath, (err, content) => {
    if (err) {
        fs.readFile(path.join(__dirname, 'error.html'), (err, data) => {
            if (err) {
                res.writeHead(500)
                res.end('Error')
            } else {
                res.writeHead(200, {
                'Content-Type': 'text/html'
            })
            res.end(data)
    }
    })
    } else {
        res.writeHead(200, {
        'Content-Type': contentType
    })
    res.end(content)
}
})
})



server.listen(port, host, () => {
    console.log(`Server listens http://${host}:${port}`)
})
*/

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 7000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('*', (req, res) => {
    let filePath = path.join(__dirname, req.url);
    let extname = path.extname(filePath);
    let contentType = 'text/html';

    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.svg':
            contentType = 'image/svg+xml';
            break;
        case '.woff':
            contentType = 'application/x-font-ttf';
            break;
    }

    if (extname === '.woff') {
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(200, {
                    'Content-Type': contentType
                });
                res.end(content);
            }
        });
    } else {
        filePath += (extname === '') ? '.html' : '';
        fs.readFile(filePath, (err, content) => {
            if (err) {
                fs.readFile(path.join(__dirname, 'error.html'), (err, data) => {
                    if (err) {
                        res.writeHead(500);
                        res.end('Error');
                    } else {
                        res.writeHead(200, {
                            'Content-Type': 'text/html'
                        });
                        res.end(data);
                    }
                });
            } else {
                res.writeHead(200, {
                    'Content-Type': contentType
                });
                res.end(content);
            }
        });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
