const express = require('express')
const bot = require('./bot')
const app = express()
const port = 8080

app.use(express.static('public'))

app.post('/addSong', function (req, res) {
    const memberId = Buffer.from(req.query.member, 'base64').toString('ascii');
    const guildId = Buffer.from(req.query.guild, 'base64').toString('ascii');
    const title = decodeURIComponent(req.query.title);
    bot.playSong(title, memberId, guildId);
    res.send('');
});

app.get('/jukebox', (req, res) => {
    res.redirect(`/index.html#/?member=${req.query.member}&guild=${req.query.guild}`);
    // if (!req.query.member) {
    //     res.send(`Hello there Anon`);
    //     return;
    // }
    // const memberId = Buffer.from(req.query.member, 'base64').toString('ascii');
    // const guildId = Buffer.from(req.query.guild, 'base64').toString('ascii');

    // res.send(`Hello there ${bot.getMemberName(memberId, guildId)}`);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
    bot.login()
})