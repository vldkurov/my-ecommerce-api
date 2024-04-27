const UserModel = require('../../models/user');
const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} = require("../../utils");
const {CartModel} = require("../../models");
const {findByEmail} = require("../../heplers");


// const registerUser = async (req, res) => {
//     const {firstName, lastName, email, password} = req.body;
//     const transaction = await sequelize.transaction();
//     try {
//         // Check if a user with the provided email already exists
//         const existingUser = await UserModel.findOne({where: {email: email}, transaction});
//         if (existingUser) {
//             // If user exists, return an error message or redirect
//             await transaction.rollback();
//             return res.status(400).send('Email already in use.');
//         }
//
//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);
//
//         // Create the user
//         const newUser = await UserModel.create({
//             firstName,
//             lastName,
//             email,
//             password: hashedPassword,
//         }, {transaction});
//
//         await transaction.commit();
//
//         // Log the user in after successful registration
//         req.login(newUser, (err) => {
//             if (err) {
//                 console.error(err);
//                 return res.status(500).send('Error logging in after registration');
//             }
//
//             // Prepare user object for response, excluding sensitive data like the password
//             const userForResponse = {
//                 userId: newUser.userId,
//                 firstName: newUser.firstName,
//                 lastName: newUser.lastName,
//                 email: newUser.email
//             };
//
//             // Respond with the newUser object in JSON
//             res.status(201).json(userForResponse);
//         });
//     } catch (error) {
//         if (transaction) {
//             await transaction.rollback();
//         }
//         console.error(error);
//         res.status(500).send('Error registering new user');
//     }
// }

const registerUser = async (req, res) => {
    try {
        const {firstName, lastName, email, password} = req.body;
        // const existingUser = await UserModel.findOne({where: {email}});
        const existingUser = await findByEmail(email)
        if (existingUser) {
            return res.status(409).send('Email already in use');
        }

        const user = await UserModel.create({
            firstName,
            lastName,
            email,
            password
        });

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        return res.status(201).json({
            user: {
                id: user.userId,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            },
            accessToken,
            refreshToken
        });
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

// const loginUser = async (req, res, next) => {
//     passport.authenticate('local', async (err, user, info) => {
//         if (err) {
//             return res.status(500).json({message: 'An error occurred during the login process.'});
//         }
//         if (!user) {
//             req.session.destroy(); // Destroy session
//             res.clearCookie('connect.sid'); // Clear session cookie (adjust cookie name as needed)
//             return res.status(401).json({message: info.message});
//         }
//         req.logIn(user, async (err) => {
//             if (err) {
//                 return res.status(500).json({message: 'Could not log in user.'});
//             }
//             // Attempt to retrieve existing cart for the logged-in user
//             try {
//                 const cart = await CartModel.findOne({where: {userId: user.userId}});
//                 let cartId = cart ? cart.cartId : null; // If no cart exists, set cartId to null
//
//                 // Successful login, respond with user info and cartId (if exists)
//                 return res.status(200).json({
//                     message: 'Login successful.',
//                     user: {
//                         id: user.userId,
//                         email: user.email,
//                         cartId: cartId  // Include cartId in the response
//                     }
//                 });
//             } catch (error) {
//                 console.error('Failed to retrieve cart:', error);
//                 return res.status(500).json({message: 'Failed to retrieve cart information.'});
//             }
//         });
//     })(req, res, next);
// };


const loginUser = async (req, res) => {
    if (!req.user) {
        return res.status(401).send("User not authenticated");
    }
    // res.json({
    //     accessToken: generateAccessToken(req.user),
    //     refreshToken: generateRefreshToken(req.user)
    // });

    try {
        const cart = await CartModel.findOne({where: {userId: req.user.userId}});
        let cartId = cart ? cart.cartId : null; // If no cart exists, set cartId to null

        res.status(200).json({
            user: {
                id: req.user.userId,
                // email: req.user.email,
                // firstName: req.user.firstName,
                // lastName: req.user.lastName
                cartId: cartId  // Include cartId in the response
            },
            accessToken: generateAccessToken(req.user),
            refreshToken: generateRefreshToken(req.user)
        });
    } catch (error) {
        console.error('Failed to retrieve cart:', error);
        return res.status(500).json({message: 'Failed to retrieve cart information.'});
    }


};


// const logoutUser = async (req, res) => {
//     req.logout(function (err) {
//         if (err) {
//             return next(err);
//         }
//
//         // Optionally clear the session cookie
//         req.session.destroy(() => {
//             res.clearCookie('connect.sid'); // This is the default name for the session cookie for express-session, adjust if different
//             res.status(200).json({message: 'Successfully logged out.'});
//         });
//     });
// }

const logoutUser = async (req, res) => {
    // Since no server-side token invalidation is required, just respond success
    res.status(200).json({message: 'Logout successful'});
};


// const checkUser = async (req, res) => {
//     // If the middleware succeeds, user is authenticated
//
//     const cart = await CartModel.findOne({where: {userId: req.user.userId}});
//     let cartId = cart ? cart.cartId : null; // If no cart exists, set cartId to null
//
//     res.json({
//         isAuthenticated: true,
//         user: {
//             id: req.user.userId,
//             email: req.user.email,
//             cartId: cartId  // Include cartId in the response
//         }
//     });
// }

const checkUser = async (req, res) => {
    try {
        // If the middleware succeeds, user is authenticated
        const userId = req.user.userId;
        const cart = await CartModel.findOne({where: {userId: userId}});  // Assuming sub is the user ID in JWT payload
        let cartId = cart ? cart.cartId : null; // If no cart exists, set cartId to null

        return res.json({
            isAuthenticated: true,
            user: {
                id: userId,  // Assuming JWT 'sub' claim is the userId
                email: req.user.email,  // Assuming email is included in JWT payload
                cartId: cartId  // Include cartId in the response
            }
        });

    } catch (error) {
        console.error('Error checking user:', error);
        return res.status(500).json({isAuthenticated: false, error: "Failed to check user"});
    }
}


const refreshToken = async (req, res) => {
    const {refreshToken} = req.body;
    try {
        const userData = verifyRefreshToken(refreshToken);
        const user = await UserModel.findByPk(userData.sub);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.json({
            accessToken: generateAccessToken(user),
            refreshToken: generateRefreshToken(user)
        });
    } catch (error) {
        res.status(401).send("Invalid refresh token");
    }
};


module.exports = {registerUser, loginUser, logoutUser, checkUser, refreshToken}
