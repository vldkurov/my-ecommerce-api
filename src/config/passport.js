// const {Strategy: JwtStrategy, ExtractJwt} = require('passport-jwt');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const {UserModel} = require('../models');
// const config = require('./config')
//
//
// module.exports = passport => {
//
//     const options = {
//         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//         secretOrKey: config.jwt_secret,
//     };
//
//     passport.use(
//         new JwtStrategy(options, async (jwt_payload, done) => {
//             try {
//                 const user = await UserModel.findByPk(jwt_payload.userId);
//                 if (user) {
//                     return done(null, user);
//                 }
//                 return done(null, false);
//             } catch (error) {
//                 console.error(error);
//                 return done(error, false);
//             }
//         })
//     );
//
//     // Google OAuth Strategy for handling Google Sign-In
//     const googleOptions = {
//         clientID: config.google_oauth_client_id,
//         clientSecret: config.google_oauth_client_secret,
//         callbackURL: "/auth/google/callback"
//     };
//
//     passport.use(new GoogleStrategy(googleOptions, async (accessToken, refreshToken, profile, done) => {
//         // Handle user data from Google
//         console.log(profile); // Log to see the structure
//         // Here, you would find or create a user in your database
//         try {
//             let user = await UserModel.findOne({where: {googleId: profile.id}});
//             if (!user) {
//                 user = await UserModel.create({
//                     googleId: profile.id,
//                     firstName: profile.name.givenName,
//                     lastName: profile.name.familyName,
//                     email: profile.emails[0].value
//                     // Other data transformations as needed
//                 });
//             }
//             return done(null, user);
//         } catch (error) {
//             return done(error, null);
//         }
//     }));
// };

