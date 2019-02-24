const express = require('express')
const bot = require('./bot')
const app = express()
var request = require('request');
const port = (process.env.PORT) ? process.env.PORT : 8080;

app.use(express.static('public'))

app.post('/addSong', function (req, res) {
    const memberId = Buffer.from(req.query.member, 'base64').toString('ascii');
    const guildId = Buffer.from(req.query.guild, 'base64').toString('ascii');
    const title = decodeURIComponent(req.query.title);
    bot.playSong(title, memberId, guildId);
    res.send('');
});

app.post('/playsound', function (req, res) {
    const memberId = Buffer.from(req.query.member, 'base64').toString('ascii');
    const guildId = Buffer.from(req.query.guild, 'base64').toString('ascii');
    const id = decodeURIComponent(req.query.id);
    bot.playSong('GLaDOS - You Are A Horrible Person', memberId, guildId);
    res.send('');
});

app.get('/jukebox_debug', (req, res) => {
    request.get(`/index.html#/?member=${req.query.member}&guild=${req.query.guild}`, (err, response, body) => {
        if (!err) {
            req.send(body);
        }
    })
});

app.get('/jukebox', (req, res) => {
    res.redirect(`/index.html#/?member=${req.query.member}&guild=${req.query.guild}`);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
    bot.login()
})

