import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import { config } from './config';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret,
};

passport.use(
  new JwtStrategy(opts, (jwtPayload, done) => {
    try {
      // Attach user details to the request object
      done(null, { id: jwtPayload.id, role: jwtPayload.role });
    } catch (error) {
      done(error, false);
    }
  })
);

export default passport;
