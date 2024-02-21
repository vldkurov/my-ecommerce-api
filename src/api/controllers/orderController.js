const {OrderModel, OrderDetailModel, ProductModel} = require('../../models')
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

module.exports = {getAllOrders, getOrderByID}