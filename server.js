const express = require('express');
const session = require('express-session');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const path = require('path');

const app = express();

// ⚠️ Встав свій Steam API ключ сюди
const STEAM_API_KEY = '73A28A895264D1BD677BF77BF8D570CA';

// ⚠️ Встав свій домен
const APP_URL = 'https://ua-kozaky-cs2-fun.onrender.com';

passport.use(new SteamStrategy({
    returnURL: `${APP_URL}/auth/steam/return`,
    realm: `${APP_URL}/`,
    apiKey: STEAM_API_KEY
}, (identifier, profile, done) => done(null, profile)));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

app.use(session({
    secret: 'kozaki_secret',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname)));

app.get('/auth/steam', passport.authenticate('steam'));

app.get('/auth/steam/return',
    passport.authenticate('steam', { failureRedirect: '/' }),
    (req, res) => res.redirect('/')
);

app.get('/api/profile', (req, res) => {
    if(req.user) {
        res.json({
            name: req.user.displayName,
            avatar: req.user.photos[2].value
        });
    } else {
        res.json({ name:null, avatar:null });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

