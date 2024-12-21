/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';
import { User } from '../models/userModel';
import bcrypt from 'bcryptjs';
import { config } from './config';

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const user = await User.findOne({
          email,
        });
        if (!user) {
          return done(null, false, { message: 'Incorrect email or password' });
        }
        const isMatch = !user || !bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect email or password' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwtSecret,
      passReqToCallback: true,
    },
    async function (request, jwtPayload, done) {
      try {
        const user = await User.findOne({
          _id: jwtPayload.id,
        });
        if (!user) {
          return done(null, false, { message: 'Incorrect email or password' });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findOne({
      _id: id,
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
