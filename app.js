/* eslint-disable new-cap, no-console, func-names, object-shorthand, prefer-destructuring */
const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const Pusher = require('pusher');

dotenv.load();
const rootUrl = (process.env.ROOT_URL || 'http://localhost');
const port = Number(process.env.PORT || 3000);
const currentEnv = process.env.NODE_ENV;

/* ****************************** PUSHER SETUP ***************************** */
const pusherAppId = process.env.PUSHER_APPID || null;
const pusherKey = process.env.PUSHER_KEY || null;
const pusherSecret = process.env.PUSHER_SECRET || null;
const pusherCluster = process.env.PUSHER_CLUSTER || null;

const pusherOptions = {
  appId: pusherAppId,
  key: pusherKey,
  secret: pusherSecret,
  cluster: pusherCluster,
  encrypted: true,
};
const pusher = new Pusher(pusherOptions);

/* ****************************** EXPRESS SETUP ***************************** */

const app = express();
app.set('json spaces', 2);
app.set('view engine', 'ejs'); // Set Express's view engine to EJS
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* ****************************** EXPRESS ROUTES **************************** */

// Default Endpoint
app.all('/', (req, res) => {
  const protocol = (currentEnv && currentEnv === 'production') ? 'https' : req.protocol;
  const currentHost = (req.hostname === 'localhost') ? `localhost:${port}` : req.hostname;
  res.render('login.ejs', {
    currentHostUrl: `${protocol}://${currentHost}`,
  });
});

app.all('/home', (req, res) => {
  const protocol = (currentEnv && currentEnv === 'production') ? 'https' : req.protocol;
  const username = req.body.username;
  const currentHost = (req.hostname === 'localhost') ? `localhost:${port}` : req.hostname;
  console.log(`${protocol}://${currentHost}`);
  res.render('index.ejs', {
    currentHostUrl: `${protocol}://${currentHost}`,
    authEndpoint: `${protocol}://${currentHost}/pusher/auth`,
    messageEndpoint: `${protocol}://${currentHost}/pusher/message`,
    username,
    pusherAppKey: pusherKey,
    pusherCluster,
  });
});

app.all('/pusher/auth', (req, res) => {
  console.log('req.method', req.method);
  console.log('req.headers', req.headers);
  console.log('req.auth', req.auth);
  console.log('req.params', req.params);
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const userId = req.headers.user_id;
  const userName = req.headers.user_name;
  const presenceData = {
    user_id: userId,
    user_info: {
      username: userName,
      userId: userId,
    },
  };
  const auth = pusher.authenticate(socketId, channel, presenceData);
  console.log(auth);
  res.send(auth);
});

app.post('/pusher/message', (req, res) => {
  console.log('/pusher/auth', req.body);

  const payload = {
    username: req.body.username,
    message: req.body.messageText,
    sentTime: req.body.messageTime,
  };

  pusher.trigger('user-messages', 'new-user-message', payload);
  return res.json({ status: 'ok' });
});

/* ******************************* SERVER LISTEN **************************** */

// Server Listen
app.listen(port, () => {
  console.log(`\nApp server is running on ${rootUrl}:${port}\n`);
});
