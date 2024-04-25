const {CartModel, CartItemModel, ProductModel, OrderModel, OrderDetailModel} = require('../../models')
const {sendSuccessResponse, sendErrorResponse} = require("../../heplers");
const {calculateTotalPrice, formatPrice} = require("../../utils");

const createCart = async (req, res) => {
    const userId = req.user.userId;

    console.log('api userId', userId);

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
    const userId = req.user.userId;
    const {cartId} = req.params;

    try {
        const queryOptions = {
            where: {userId: userId},
            include: [{
                model: CartItemModel,
                as: 'items',
                include: [{
                    model: ProductModel,
                    as: 'product'
                }]
            }]
        };

        if (cartId) {
            queryOptions.where.cartId = cartId;  // Use cartId if provided
        }

        const cart = await CartModel.findOne(queryOptions);

        if (!cart) {
            return sendErrorResponse(res, 404, 'Cart not found');
        }

        const totalPrice = calculateTotalPrice(cart.items.map(item => ({
            Product: {price: item.product.price},
            quantity: item.quantity
        })));

        const order = await OrderModel.create({
            userId: userId,
            totalPrice: totalPrice.toFixed(2),
            status: 'pending'
        });

        for (const item of cart.items) {
            await OrderDetailModel.create({
                orderId: order.orderId,
                productId: item.productId,
                price: parseFloat(item.product.price.replace(/[^0-9.-]+/g, "")),
                quantity: item.quantity
            });
        }

        // Optionally clear the cart after creating an order
        await CartItemModel.destroy({where: {cartId: cart.cartId}});

        sendSuccessResponse(res, 201, {
            orderId: order.orderId,
            status: order.status,
            totalPrice: formatPrice(`${totalPrice}`)
        });
    } catch (error) {
        sendErrorResponse(res, 500, 'Error creating order', error);
    }
};

const deleteProductFromCart = async (req, res) => {
    const {cartId, cartItemId} = req.params;


    try {
        // Fetch the cart item to ensure it exists and belongs to the correct cart
        const cartItem = await CartItemModel.findByPk(cartItemId);


        if (!cartItem) {
            return sendErrorResponse(res, 404, 'Cart item not found');
        }

        if (cartItem.cartId !== parseInt(cartId)) {
            return sendErrorResponse(res, 403, 'Access to cart denied');
        }

        // Ensure the cart belongs to the current user
        const cart = await CartModel.findByPk(cartId);
        if (cart.userId !== req.user.userId) {
            return sendErrorResponse(res, 403, 'Unauthorized to access this cart');
        }

        // Delete the cart item
        await CartItemModel.destroy({
            where: {
                cartItemId: cartItemId
            }
        });


        sendSuccessResponse(res, 200, {message: 'Item deleted successfully', cartItemId: cartItemId});
    } catch (error) {
        sendErrorResponse(res, 500, 'Error deleting cart item', error.toString());
    }
}


module.exports = {createCart, addProductToCart, getCartContentByID, cartCheckout, deleteProductFromCart}
