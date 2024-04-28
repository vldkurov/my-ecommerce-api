const express = require('express');
const passport = require('passport');
const {registerUser, loginUser, checkUser, refreshToken} = require('../controllers');
const {isAuthenticated, authenticateLocal} = require("../middlewares");
const config = require('../../config/config');
const {CartModel} = require("../../models");

const router = express.Router();


router.post('/register', registerUser);
// router.post('/login', loginUser);
router.post('/login', authenticateLocal, loginUser);
router.post('/refresh', refreshToken);
// router.post('/logout', isAuthenticated, logoutUser);
// Route to check user authentication status
router.get('/check', isAuthenticated, checkUser);


// Google
router.get('/auth/google',
    passport.authenticate('google', {scope: ['profile', 'email']}));

// router.get('/auth/google/callback',
//     passport.authenticate('google', {failureRedirect: '/login'}),
//     function (req, res) {
//         // Successful authentication, redirect home or wherever you like.
//         // res.redirect('/');
//         res.redirect(config.client_url);
//     });

// router.get('/auth/google/callback',
//     passport.authenticate('google', {failureRedirect: '/login'}),
//     (req, res) => {
//         // Send the JWT to the client directly
//         res.json({
//             success: true,
//             user: req.user.user,
//             accessToken: req.user.accessToken,
//             refreshToken: req.user.refreshToken,
//         });
//     });

// router.get('/auth/google/callback',
//     passport.authenticate('google', {failureRedirect: '/login', session: false}),
//     (req, res) => {
//         // Send the JWT to the client directly
//         if (!req.user) {
//             return res.redirect('/login');
//         }
//         const accessToken = req.authInfo.accessToken; // Access the token passed through the done function
//         const refreshToken = req.authInfo.refreshToken;
//
//         res.json({
//             success: true,
//             accessToken: accessToken,
//             refreshToken: refreshToken,
//             user: {id: req.user.userId, email: req.user.email}
//         });
//         // res.redirect(config.client_url);
//     });

// router.get('/auth/google/callback',
//     passport.authenticate('google', {failureRedirect: '/login', session: false}),
//     (req, res) => {
//         if (!req.user) {
//             return res.redirect('/login');
//         }
//
//         const {accessToken, refreshToken} = req.user;
//
//         res.json({
//             success: true,
//             accessToken: accessToken,
//             refreshToken: refreshToken,
//             user: {id: req.user.user.userId, email: req.user.user.email}
//         });
//     });

router.get('/auth/google/callback',
    passport.authenticate('google', {failureRedirect: '/login', session: false}),
    async function (req, res) {
        if (req.user) {
            // Prepare the tokens data

            const cart = await CartModel.findOne({where: {userId: req.user.user.userId}});
            let cartId = cart ? cart.cartId : null; // If no cart exists, set cartId to null

            const data = {
                tokens: {
                    accessToken: req.user.accessToken,
                    refreshToken: req.user.refreshToken
                },
                user: {
                    id: req.user.user.userId,
                    email: req.user.user.email,
                    cartId: cartId
                }
            };

            // Encode the tokens data to a base64 string
            const encodedData = Buffer.from(JSON.stringify(data)).toString('base64');
            res.redirect(`${config.client_url}/#data=${encodedData}`);
        } else {
            res.redirect(`${config.client_url}/login`);
        }
    });


module.exports = router;
