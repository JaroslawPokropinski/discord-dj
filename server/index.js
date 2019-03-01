const express = require('express');
var cors = require('cors');
const bot = require('./bot');
const app = express();
const config = require('./config');
const request = require('request');
const dc = require('./config/discord_config.json');
const port = (process.env.PORT) ? process.env.PORT : 8080;
const oauthUrl = `${dc.oauth_url}?client_id=${dc.client_id}&redirect_uri=${dc.redirect_uri}&response_type=${dc.response_type}&scope=${dc.scope}`;

app.use(cors())
app.use(express.static('public'))
app.use('/app', express.static('app'))

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
    const id = req.query.id;
    if (id === '0') {
        bot.playSong('GLaDOS - You Are A Horrible Person', memberId, guildId);
    }
    if (id === '1') {
        bot.playSong('Portal 2: Guilty', memberId, guildId);
    }
    
    res.send('');
});

app.get('/jukebox_debug', (req, res) => {
    request.get(`/index.html#/?member=${req.query.member}&guild=${req.query.guild}`, (err, response, body) => {
        if (!err) {
            res.send(body);
        }
    })
});

app.get('/jukebox', (req, res) => {
    res.redirect(`/app/index.html#/?member=${req.query.member}&guild=${req.query.guild}`);
});

app.get('/', (req, res) => {
  res.redirect(oauthUrl);
});

app.get('/login', (req, res) => {
  if (req.query.code) {
    res.redirect(`${config.frontend_url}app/#/login?code=${req.query.code}`);
  } else {
    res.redirect(`${config.frontend_url}app/#/login`);
  }
});

app.get('/getUserInfo', (req, res, next) => {
  if (!req.query.code) {
    next('Code is not set!');
    return;
  }
  const code = req.query.code;
  const data = {
    'client_id': dc.client_id,
    'client_secret': dc.client_secret,
    'grant_type': 'client_credentials',
    'code': code,
    'redirect_uri': decodeURIComponent(dc.redirect_uri),
    'scope': decodeURIComponent(dc.scope)
  };
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  request.post({ url: dc.token_url, form: data, headers: headers}, function (err, httpResponse, body) {
    if (err) {
      next(err);
    } else {
      res.send(JSON.parse(body));
    }
  });
});

app.get('/getGuilds', (req, res, next) => {
  const access_token = req.header('Authorization');
  const headers = {
    'Authorization': access_token
  }
  request.get({ url: `${dc.api_url}/users/@me/guilds`, headers: headers }, function (err, httpResponse, body) {
    if (err) {
      next(err);
    } else {
      let response = [];
      const guilds = JSON.parse(body);
      try {
        for (let guild of guilds) {
          if (bot.getMe(guild)) {
            response.push(guild);
          }
        }
        res.send(response);
      } catch(e) {
        console.log(guilds);
        res.send('');
      }
      
    }
  });
});

app.get('/getUser', (req, res, next) => {
  if (!req.query.guild) {
    next('Guild id is not set!');
    return;
  }
  if (!req.header('Authorization')) {
    next('No Authorization token!');
    return;
  }
  const access_token = req.header('Authorization');

  const guildId = req.query.guild;
  const headers = {
    'Authorization': access_token
  }
  request.get({ url: `${dc.api_url}/users/@me`, headers: headers }, function (err, httpResponse, body) {
    if (err) {
      next(err);
    } else {
      const user = JSON.parse(body);
      bot.fetchMember(user.id, guildId).then((member) => {
        res.send(member.id);
      });
    }
  });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
    bot.login()
})

