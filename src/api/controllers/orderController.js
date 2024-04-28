const {OrderModel, OrderDetailModel, ProductModel, CartItemModel, CartModel} = require('../../models')
const {formatPrice, calculateTotalPrice} = require("../../utils");
const {sendSuccessResponse, sendErrorResponse} = require("../../heplers");

const config = require('../../config/config');

const domainURL = config.domain_url || `http://localhost:3030`;
const clientURL = config.client_url || `http://localhost:3000`;


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

const cancelOrder = async (req, res) => {
    const {orderId} = req.params;
    const userId = req.user.userId;

    try {
        const order = await OrderModel.findOne({
            where: {orderId: orderId, userId: userId}
        });

        if (!order) {
            return sendErrorResponse(res, 404, 'Order not found');
        }

        order.status = 'cancelled';
        await order.save();

        sendSuccessResponse(res, 200, {message: 'Order cancelled successfully', order});
    } catch (error) {
        sendErrorResponse(res, 500, 'Failed to cancel order', error);
    }
};

const STRIPE_SECRET_KEY = config.stripe_secret
const stripe = require('stripe')(STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
    const {orderId} = req.body;

    const userId = req.user.userId;

    try {

        const order = await OrderModel.findOne({
            where: {
                orderId: orderId,
                userId: userId
            },
            include: [{
                model: OrderDetailModel,
                as: 'OrderDetails',
                include: [{
                    model: ProductModel,
                    as: 'Product'
                }]
            }]
        });

        if (!order) {
            return res.status(404).json({error: 'Order not found or does not belong to user'});
        }

        const line_items = order.OrderDetails.map(item => ({
            price_data: {
                currency: 'gbp',
                product_data: {
                    name: item.Product.name,
                    description: item.Product.description,
                },
                unit_amount: Math.round(parseFloat(item.price.replace(/[^\d.]/g, '')) * 100),
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${domainURL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${domainURL}/cancel?session_id={CHECKOUT_SESSION_ID}`,
            metadata: {orderId: orderId.toString()},
        });


        res.json({sessionId: session.id, url: session.url});

    } catch (error) {
        console.error('Failed to create checkout session:', error);
        res.status(500).json({error: {message: error.message}});
    }
};


const handlePaymentSuccess = async (req, res) => {
    const sessionId = req.query.session_id;

    console.log('handlePaymentSuccess req.query', req.query);

    console.log('sessionId', sessionId);

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            const update = await OrderModel.update(
                {status: 'completed'},
                {where: {orderId: session.metadata.orderId}}
            );

            if (update) {
                res.redirect(`${clientURL}/orders/${session.metadata.orderId}`);
            } else {
                console.error('Update failed');
                res.status(500).send('Failed to update order status');
            }
        } else {
            res.redirect(`${domainURL}/cancel?session_id={CHECKOUT_SESSION_ID}`);
        }
    } catch (error) {
        console.error('Error processing success URL:', error);
        res.status(500).send('Error fetching orders');
    }
};


const handlePaymentCancellation = async (req, res) => {
    const sessionId = req.query.session_id;

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const orderId = session.metadata.orderId;

        await OrderModel.update({status: 'cancelled'}, {
            where: {orderId: orderId}
        });

        res.redirect(`${clientURL}/orders/${session.metadata.orderId}`);
    } catch (error) {
        console.error('Error cancelling payment:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};


module.exports = {
    getAllOrders,
    getOrderByID,
    createOrder,
    cancelOrder,
    createCheckoutSession,
    handlePaymentSuccess,
    handlePaymentCancellation
}
