const express = require('express');
var cors = require('cors');
const bot = require('./bot');
const app = express();
const request = require('request');
const dc = require('./config/discord_config.json');
const port = (process.env.PORT) ? process.env.PORT : 8080;
const oauthUrl = `${dc.oauth_url}?client_id=${dc.client_id}&redirect_uri=${process.env.DC_REDIRECT}&response_type=${dc.response_type}&scope=${dc.scope}`;


app.use(cors())
app.use('/app', express.static('public'))

app.get('/', function (req, res) {
  res.redirect('/app')
});

app.post('/addSong', function (req, res, next) {
  let memberId = req.query.member;
  let guildId = req.query.guild;
  let title;
  try {
    title = decodeURIComponent(req.query.title);
  } catch (e) {
    console.error(JSON.stringify(e));
    return res.status(400).send('Set title');
  }

  bot.playSong(title, memberId, guildId)
    .then((r) => {
      if (r) {
        res.send(`Added "${title}" to queue`);
      } else {
        next('bot.playSong returned undefined')
      }
    })
    .catch((e) => {
      if (e.message) {
        return res.status(500).send(e.message);
      } else {
        return res.status(500).send(e);
      }
    })
});

app.post('/playSound', function (req, res) {
  const memberId = req.query.member;
  const guildId = req.query.guild;
  const id = req.query.id;
  if (id === '0') {
    bot.playSong('GLaDOS - You Are A Horrible Person', memberId, guildId)
      .then((r) => {
        if (r) {
          res.send(`Added "${'GLaDOS - You Are A Horrible Person'}" to queue`);
        } else {
          next('bot.playSong returned undefined')
        }
      })
      .catch((e) => {
        if (e.message) {
          return res.status(500).send(e.message);
        } else {
          return res.status(500).send(e);
        }
      });
  }
  if (id === '1') {
    bot.playSong('Portal 2: Guilty', memberId, guildId)
      .then((r) => {
        if (r) {
          res.send(`Added "${'Portal 2: Guilty'}" to queue`);
        } else {
          next('bot.playSong returned undefined')
        }
      })
      .catch((e) => {
        if (e.message) {
          return res.status(500).send(e.message);
        } else {
          return res.status(500).send(e);
        }
      });
  }
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


app.get('/login', (req, res) => {
  if (req.query.code) {
    res.redirect(`${process.env.FRONTEND_URL}app/#/login?code=${req.query.code}`);
  } else {
    res.redirect(oauthUrl);
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
    'client_secret': process.env.DC_SECRET,
    'grant_type': 'authorization_code',
    'code': code,
    'redirect_uri': process.env.DC_REDIRECT,
    'scope': dc.scope
  };
  let dataEncoded = [];
  for (let k in data) {
    dataEncoded.push(`${k}=${data[k]}`);
  }
  console.log(dataEncoded.join('&'));
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  // let dataEncoded = `client_id=${data.client_id}&client_secret=${data.client_secret}&grant_type=${data.grant_type}&code=${data.code}&redirect_uri=${data.redirect_uri}&scope=${data.scope}`;
  // dataEncoded = encodeURIComponent(dataEncoded);
  request.post({ url: dc.token_url, form: dataEncoded.join('&'), headers: headers }, function (err, httpResponse, body) {
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
      console.log(guilds);
      try {
        for (let guild of guilds) {
          if (bot.getMe(guild)) {
            response.push(guild);
          }
        }
        res.send(response);
      } catch (e) {
        if (guilds.message) {
          res.status(401).send(guilds.message);
        } else {
          next(e);
        }

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
      let user;
      try {
        user = JSON.parse(body);
      } catch (e) {
        console.error(e);
        next(e);
      }
      bot.fetchMember(user.id, guildId)
        .then((member) => {
          res.send(`"${member.id}"`);
        })
        .catch((error) => {
          next(error);
        });
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
  bot.login()
})

