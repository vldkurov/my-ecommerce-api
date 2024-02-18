const {OrderModel, OrderDetailModel, ProductModel} = require('../../models')


const getAllOrders = async (req, res) => {
    try {
        const userId = req.user.userId; // Assuming the user ID is attached to the request object
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

        const ordersWithFormattedPrices = orders.map((order) => {
            // Deep clone the order object to avoid mutating the original data
            const orderClone = JSON.parse(JSON.stringify(order));

            // Initialize totalPrice as 0 for accumulation
            let totalPrice = 0;

            orderClone.OrderDetails.forEach((detail) => {
                // Assuming detail.Product.price is a string like "£962.00", extract the numeric part
                const priceNumeric = parseFloat(detail.Product.price.replace(/[^\d.-]/g, ''));

                // Reassign the detail's price with formatted string, ensuring numeric operation was successful
                detail.price = !isNaN(priceNumeric) ? `£${priceNumeric.toFixed(2)}` : "Invalid Price";

                // Accumulate totalPrice for the order
                totalPrice += !isNaN(priceNumeric) ? priceNumeric * detail.quantity : 0;
            });

            // Format and assign the accumulated totalPrice to the order
            orderClone.totalPrice = `£${totalPrice.toFixed(2)}`;

            return orderClone;
        });

        res.json(ordersWithFormattedPrices);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Internal Server Error');
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
            return res.status(404).send('Order not found');
        }

        // Convert Sequelize model instance to a plain object
        const orderJSON = order.toJSON();

        // Calculate and format totalPrice for the order
        let totalPrice = 0;

        if (orderJSON.OrderDetails) {
            orderJSON.OrderDetails.forEach(detail => {
                // Extract the numeric part of the price from the Product
                const numericPrice = parseFloat(detail.Product.price.replace(/[^\d.-]/g, ''));
                // Calculate and format the price for this OrderDetail
                detail.price = !isNaN(numericPrice) ? `£${numericPrice.toFixed(2)}` : "Invalid Price";
                // Accumulate totalPrice for the order
                totalPrice += !isNaN(numericPrice) ? numericPrice * detail.quantity : 0;
            });
        }

// Format and assign the accumulated totalPrice to the order
        orderJSON.totalPrice = `£${totalPrice.toFixed(2)}`;

// Replace the original order response with the adjusted one
        res.json(orderJSON);

    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).send('Internal Server Error');
    }
}


module.exports = {getAllOrders, getOrderByID}