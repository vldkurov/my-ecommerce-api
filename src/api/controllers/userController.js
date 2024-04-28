const UserModel = require('../../models/user');
const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} = require("../../utils");
const {CartModel} = require("../../models");
const {findByEmail} = require("../../heplers");
const config = require("../../config/config");


const registerUser = async (req, res) => {
    try {

        const {firstName, lastName, email, password} = req.body;
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


const loginUser = async (req, res) => {
    if (!req.user) {
        return res.status(401).send("User not authenticated");
    }


    try {
        const cart = await CartModel.findOne({where: {userId: req.user.userId}});
        let cartId = cart ? cart.cartId : null; // If no cart exists, set cartId to null

        res.status(200).json({
            user: {
                userId: req.user.userId,
                email: req.user.email,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
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


const logoutUser = async (req, res) => {
    // Since no server-side token invalidation is required, just respond success
    res.status(200).json({message: 'Logout successful'});
};


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

const googleOAuth = async function (req, res) {
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
                firstName: req.user.user.firstName,
                lastName: req.user.user.lastName,
                cartId: cartId
            }
        };

        // Encode the tokens data to a base64 string
        const encodedData = Buffer.from(JSON.stringify(data)).toString('base64');
        res.redirect(`${config.client_url}/#data=${encodedData}`);
    } else {
        res.redirect(`${config.client_url}/login`);
    }
}


module.exports = {registerUser, loginUser, logoutUser, checkUser, refreshToken, googleOAuth}
