/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../models/userModel';
// Passport Local Strategy
passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        // Check if the user exists
        const user = await User.findOne({
          where: {
            email,
          },
        });
        if (!user) {
          return done(null, false, { message: 'Incorrect email or password' });
        }

        // // Compare password
        // const isMatch = await User.comparePassword(password, user.password);
        // if (!isMatch) {
        //   return done(null, false, { message: 'Incorrect email or password' });
        // }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findOne({
      where: {
        id,
      },
    }); // Adjust to find user by ID
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport