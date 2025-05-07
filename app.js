const express = require('express');
const cors = require('cors')
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const bcrypt = require("bcryptjs");

const app = express();

const prisma = require("./db/prisma");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const profilesRouter = require('./routes/profiles');
const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');

app.use(logger('dev'));
app.use(cors({
    origin: 'http://localhost:5173', 
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true
  }));
  app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
      cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
      secure: false, 
      sameSite: 'lax',
      },
      secret: 'imported mundane prefer taste nappy',
      resave: true,
      saveUninitialized: true,
      store: new PrismaSessionStore(
        prisma,
        {
          checkPeriod: 2 * 60 * 1000,  //ms
          dbRecordIdIsSessionId: true,
          dbRecordIdFunction: undefined,
        }
      )
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/profile', profilesRouter);
app.use('/post', postsRouter);
app.use('/comment', commentsRouter);

passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await prisma.user.findUnique({where: {username: username},})
  
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch(err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.user.findUnique({where: {id: id}})
      if (!user) console.log('No user found in DB for id', id);
      done(null, user);
    } catch(err) {
      console.log('Error during deserialization:', err);
      done(err);
    }
  });

module.exports = app;
