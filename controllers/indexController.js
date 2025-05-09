const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const crypto = require('crypto');
const passport = require('passport');
const prisma = require("../db/prisma");

const validateUser = [
    body("email").trim()
    .isEmail(),
    body("username").trim()
    .isAlphanumeric().withMessage(`Username must only contain alphanumeric characters`)
    .isLength({ min: 1, max: 10 }).withMessage(`Username must be between 1 and 10 characters`),
  body("password").trim()
    .isStrongPassword({options: {minLength: 5}}).withMessage("Password is not long enough"),
    body("confirm_password").trim()
    .custom((value, { req }) => {
        return value === req.body.password;
      }),
]

exports.createUserPost = [ validateUser, async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await prisma.user.create({
         data: {
            email: req.body.email,
          username: req.body.username,
           password: hashedPassword,
         },
       });
       const email = user.email;
       const hash = crypto.createHash('sha256').update(email).digest('hex');
       const profile = await prisma.profile.create({
        data: {
          userId: user.id,
          avatar: `https://www.gravatar.com/avatar/${hash}?s=80&d=identicon`,
        },
      });
      return res.status(201).json(user);
       } catch (error) {
          console.error(error);
          next(error);
         }
}
]

exports.userLoginPost = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) { return res.status(401).json({ message: 'Login failed' }); }
    req.login(user, (err) => {
      if (err) { return next(err); }
      return res.json({ message: 'Logged in successfully' });
    });
  })(req, res, next);
}

exports.userLogoutPost = async (req, res, next) => {
    req.logout((err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
}