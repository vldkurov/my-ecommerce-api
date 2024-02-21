const {CartModel, CartItemModel, ProductModel, OrderModel, OrderDetailModel} = require('../../models')
const {sendSuccessResponse, sendErrorResponse} = require("../../heplers");

const createCart = async (req, res) => {
    const userId = req.user.userId;

    try {
        let cart = await CartModel.findOne({where: {userId}});
        if (!cart) {
            cart = await CartModel.create({userId});
        }
        sendSuccessResponse(res, 201, cart);
    } catch (error) {
        sendErrorResponse(res, 500, 'Error creating or retrieving cart', error);
    }
}

const addProductToCart = async (req, res) => {
    const {cartId} = req.params;
    const {productId, quantity} = req.body;

    try {
        const cart = await CartModel.findByPk(cartId);
        if (!cart) {
            return sendErrorResponse(res, 404, 'Cart not found');
        }

        // Check if the cart belongs to the current user
        if (cart.userId !== req.user.userId) {
            return sendErrorResponse(res, 403, 'Access denied');
        }

        // Add or update the product in the cart
        const [item, created] = await CartItemModel.findOrCreate({
            where: {cartId, productId},
            defaults: {quantity}
        });

        if (!created) {
            item.quantity += quantity;
            await item.save();
        }

        // Fetch the product name from the Product model
        const product = await ProductModel.findByPk(productId);
        if (!product) {
            return sendErrorResponse(res, 404, 'Product not found');
        }

        const response = {...item.get({plain: true}), productName: product.name};

        sendSuccessResponse(res, 201, response);
    } catch (error) {
        sendErrorResponse(res, 500, 'Error adding product to cart', error);
    }
}

const getCartContentByID = async (req, res) => {
    const {cartId} = req.params;

    try {
        const cart = await CartModel.findByPk(cartId, {
            include: [{
                model: CartItemModel,
                as: 'items',
                include: ['product']
            }]
        });

        if (!cart) {
            return sendErrorResponse(res, 404, 'Cart not found');
        }

        // Check if the cart belongs to the current user
        if (cart.userId !== req.user.userId) {
            return sendErrorResponse(res, 403, 'Access denied');
        }

        // return res.json(cart);
        sendSuccessResponse(res, 200, cart);
    } catch (error) {
        sendErrorResponse(res, 500, 'Error retrieving cart', error);
    }
}

const cartCheckout = async (req, res) => {
    const {cartId} = req.params;

    try {
        // Validate the Cart
        const cart = await CartModel.findOne({
            where: {cartId: cartId, userId: req.user.userId},
            include: [{
                model: CartItemModel,
                as: 'items',
                include: ['product']
            }]
        });

        if (!cart) {
            return sendErrorResponse(res, 404, 'Cart not found');
        }

        // Assuming you are inside the checkout logic
        let totalPrice = cart.items.reduce((total, item) => {
            // Access the raw numeric value of the price
            const rawPrice = item.product.getDataValue('price');
            const itemPrice = parseFloat(rawPrice);
            return total + (item.quantity * itemPrice);
        }, 0);

        // Create the Order with totalPrice
        const order = await OrderModel.create({
            userId: req.user.userId,
            totalPrice,
            status: 'pending',
            // other fields...
        });

        // Create order details for each cart item
        await Promise.all(cart.items.map(async (item) => {
            await OrderDetailModel.create({
                orderId: order.orderId,
                productId: item.productId,
                quantity: item.quantity,
                price: parseFloat(item.product.price)
            });
        }));

        // Optionally, clear the cart after checkout
        await CartItemModel.destroy({where: {cartId}});

        const formattedTotalPrice = isNaN(totalPrice) ? "£0.00" : `£${totalPrice.toFixed(2)}`;

        const response = {
            ...order.get({plain: true}),
            totalPrice: formattedTotalPrice,
        };

        sendSuccessResponse(res, 201, response);

    } catch (error) {
        sendErrorResponse(res, 500, 'Error processing checkout', error);
    }
}

module.exports = {createCart, addProductToCart, getCartContentByID, cartCheckout}