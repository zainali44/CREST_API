import session from "express-session";
import cors from "cors";
import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Set up static file serving for the upload directory
const uploadPath = path.join(__dirname, '../../upload');
app.use('/upload', express.static(uploadPath));

// Session configuration
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// Passport configuration
passport.use(new GoogleStrategy({
    clientID: process.env.G_CLIENT_ID,
    clientSecret: process.env.G_CLIENT_SECRET,
    callbackURL: '/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    console.log(`"DATA : ${accessToken} , ..${refreshToken}  ${profile} . ${done}`)
    return done(null, profile);
  }
));

app.use(passport.initialize());
app.use(passport.session());

// Middleware to parse JSON
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});


export default app;