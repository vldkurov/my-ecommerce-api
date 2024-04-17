const {OrderModel, OrderDetailModel, ProductModel, CartItemModel, CartModel} = require('../../models')
const {formatPrice, calculateTotalPrice} = require("../../utils");
const {sendSuccessResponse, sendErrorResponse} = require("../../heplers");


const getAllOrders = async (req, res) => {
    try {
        const userId = req.user.userId;
        const orders = await OrderModel.findAll({
            where: {userId: userId},
            include: [{
                model: OrderDetailModel,
                as: 'OrderDetails',
                include: [{
                    model: ProductModel,
                    as: 'Product'
                }]
            }]
        });

        const formattedOrders = orders.map((order) => {
            // Convert Sequelize model instance to a plain object
            const orderJSON = order.toJSON();

            // Format each detail's price and calculate total price
            orderJSON.OrderDetails.forEach(detail => detail.price = formatPrice(detail.Product.price));
            orderJSON.totalPrice = `£${calculateTotalPrice(orderJSON.OrderDetails).toFixed(2)}`;

            return orderJSON;
        });

        sendSuccessResponse(res, 200, formattedOrders);
    } catch (error) {
        sendErrorResponse(res, 500, 'Error fetching orders', error);
    }
}

const getOrderByID = async (req, res) => {
    const {orderId} = req.params;
    try {
        const order = await OrderModel.findOne({
            where: {orderId: orderId, userId: req.user.userId},
            include: [{
                model: OrderDetailModel,
                as: 'OrderDetails',
                include: [{model: ProductModel, as: 'Product'}]
            }]
        });

        if (!order) {
            return sendErrorResponse(res, 404, 'Order not found', error);
        }

        // Convert Sequelize model instance to a plain object
        const orderJSON = order.toJSON();

        orderJSON.OrderDetails.forEach(detail => detail.price = formatPrice(detail.Product.price));
        orderJSON.totalPrice = `£${calculateTotalPrice(orderJSON.OrderDetails).toFixed(2)}`;

        sendSuccessResponse(res, 200, orderJSON);

    } catch (error) {
        sendErrorResponse(res, 500, 'Error fetching orders', error);
    }
}

const createOrder = async (req, res) => {
    const userId = req.user.userId;
    const {cartId} = req.body;  // Accept cartId from the request body

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
        // await CartItemModel.destroy({where: {cartId: cart.cartId}});

        sendSuccessResponse(res, 201, {
            orderId: order.orderId,
            status: order.status,
            totalPrice: formatPrice(`${totalPrice}`)
        });
    } catch (error) {
        sendErrorResponse(res, 500, 'Error creating order', error);
    }
};


module.exports = {getAllOrders, getOrderByID, createOrder}
