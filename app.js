const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser')
const mailer = require('./nodemailer')
const smtp = require('./config');

const app = express();
const port = 3000;
let order = undefined;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// настрой обработчика запроса
app.use(bodyParser.urlencoded({ extended: false }))
// отправка формы
app.post('/send', (req, res) => {
    // проверка заполнения обязательных полей
    if(!req.body.name || !req.body.email || !req.body.telephone) return res.sendStatus(400)
    const message = {
        to: smtp.to, // Кому (для нескольких адресатов используйте запятую)
        subject: "Заявка", // Тема письма
        text: '', // Содержимое письма
        html: `<h3>Новая заявка!</h3>
        <b>Имя:</b> ${req.body.name} </br>
        <b>Телефон:</b> ${req.body.email}</br>
        <b>Телефон:</b> ${req.body.telephone}</br>` // html код письма
    }
    mailer(message)
    order = req.body
    // редирект для предотвращения повторной отправки
    res.redirect('/confirm.html')

})
// возврат к исходному состоянию
app.get('/send', (req,res) => {
    if(typeof order !== 'object') return res.sendFile(__dirname + '/index.html')
    res.send('Заявка успешно принята!')
    order = undefined
})

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
