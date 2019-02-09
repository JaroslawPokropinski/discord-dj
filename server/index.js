const express = require('express')
const bot = require('./bot')
const app = express()
const port = 8080

app.post('/addSong', function (req, res) {
    bot.playCommand(req.title);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))