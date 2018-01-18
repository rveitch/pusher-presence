# Pusher Presence
An example chat app demonstrating the Pusher user presence API.

![screenshot](https://user-images.githubusercontent.com/12876929/35081243-9012444c-fbd8-11e7-970f-8b1c1f129e8a.png)

## Local Setup
- `$ git clone git@github.com:rveitch/pusher-presence.git`
- `$ npm install`
- Copy `template.env.txt` and rename it to `.env`
- Add your local environment variable keys to the `.env` file and save it.
- Run `$ npm start` or `$ node app` to initialize the app.
- Visit http://localhost:3000 in your browser.

## Configuration
### Local
Update the .env file with the config variables.

### Heroku
Add the config variables to your Heroku app settings.

#### Config Variables
```
PUSHER_APPID=
PUSHER_KEY=
PUSHER_SECRET=
PUSHER_CLUSTER=
```
