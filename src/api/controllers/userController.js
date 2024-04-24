const bcrypt = require('bcryptjs');
const {sequelize, UserModel, CartModel} = require("../../models");
const {findByEmail} = require("../../heplers");
const passport = require("passport");


const localStrategy = async function (email, password, done) {
    try {
        const user = await findByEmail(email);
        if (!user) {
            return done(null, false, {message: 'Incorrect email.'});
        }

        // Use bcrypt to compare the submitted password with the hashed password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return done(null, false, {message: 'Incorrect password.'});
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}

const registerUser = async (req, res) => {
    const {firstName, lastName, email, password} = req.body;
    const transaction = await sequelize.transaction();
    try {
        // Check if a user with the provided email already exists
        const existingUser = await UserModel.findOne({where: {email: email}, transaction});
        if (existingUser) {
            // If user exists, return an error message or redirect
            await transaction.rollback();
            return res.status(400).send('Email already in use.');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const newUser = await UserModel.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        }, {transaction});

        await transaction.commit();

        // Log the user in after successful registration
        req.login(newUser, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error logging in after registration');
            }

            // Prepare user object for response, excluding sensitive data like the password
            const userForResponse = {
                userId: newUser.userId,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email
            };

            // Respond with the newUser object in JSON
            res.status(201).json(userForResponse);
        });
    } catch (error) {
        if (transaction) {
            await transaction.rollback();
        }
        console.error(error);
        res.status(500).send('Error registering new user');
    }
}


const loginUser = async (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
        if (err) {
            return res.status(500).json({message: 'An error occurred during the login process.'});
        }
        if (!user) {
            req.session.destroy(); // Destroy session
            res.clearCookie('connect.sid'); // Clear session cookie (adjust cookie name as needed)
            return res.status(401).json({message: info.message});
        }
        req.logIn(user, async (err) => {
            if (err) {
                return res.status(500).json({message: 'Could not log in user.'});
            }
            // Attempt to retrieve existing cart for the logged-in user
            try {
                const cart = await CartModel.findOne({where: {userId: user.userId}});
                let cartId = cart ? cart.cartId : null; // If no cart exists, set cartId to null

                // Successful login, respond with user info and cartId (if exists)
                return res.status(200).json({
                    message: 'Login successful.',
                    user: {
                        id: user.userId,
                        email: user.email,
                        cartId: cartId  // Include cartId in the response
                    }
                });
            } catch (error) {
                console.error('Failed to retrieve cart:', error);
                return res.status(500).json({message: 'Failed to retrieve cart information.'});
            }
        });
    })(req, res, next);
};


const logoutUser = async (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }

        // Optionally clear the session cookie
        req.session.destroy(() => {
            res.clearCookie('connect.sid'); // This is the default name for the session cookie for express-session, adjust if different
            res.status(200).json({message: 'Successfully logged out.'});
        });
    });
}

const checkUser = async (req, res) => {
    // If the middleware succeeds, user is authenticated

    const cart = await CartModel.findOne({where: {userId: req.user.userId}});
    let cartId = cart ? cart.cartId : null; // If no cart exists, set cartId to null

    res.json({
        isAuthenticated: true,
        // user: {
        //     id: req.user.userId, // Example of sending back user ID
        //     // Add any other user info you wish to return
        // }
        user: {
            id: req.user.userId,
            email: req.user.email,
            cartId: cartId  // Include cartId in the response
        }
    });
}


module.exports = {registerUser, loginUser, logoutUser, localStrategy, checkUser}
