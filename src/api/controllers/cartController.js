const {CartModel, CartItemModel, ProductModel, OrderModel, OrderDetailModel} = require('../../models')

const createCart = async (req, res) => {
    const userId = req.user.userId; // Assuming you're extracting the user ID from the auth token

    try {
        let cart = await CartModel.findOne({where: {userId}});
        if (!cart) {
            cart = await CartModel.create({userId});
        }
        return res.status(201).json(cart);
    } catch (error) {
        console.error('Error creating or retrieving cart:', error);
        return res.status(500).send('Internal Server Error');
    }
}

const addProductToCart = async (req, res) => {
    const {cartId} = req.params;
    const {productId, quantity} = req.body;

    try {
        const cart = await CartModel.findByPk(cartId);
        if (!cart) {
            return res.status(404).send('Cart not found');
        }

        // Check if the cart belongs to the current user
        if (cart.userId !== req.user.userId) {
            return res.status(403).send('Access denied');
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
            return res.status(404).send('Product not found');
        }

        // Construct and send the response with the product name
        const response = {
            cartId: item.cartId,
            cartItemId: item.cartItemId,
            productId: item.productId,
            productName: product.name, // Including product name in the response
            quantity: item.quantity
        };

        return res.status(201).json(response);
    } catch (error) {
        console.error('Error adding product to cart:', error);
        return res.status(500).send('Internal Server Error');
    }
}

const getCartContentByID = async (req, res) => {
    const {cartId} = req.params;

    try {
        const cart = await CartModel.findByPk(cartId, {
            include: [{
                model: CartItemModel,
                as: 'items', // Use the alias defined in the association
                include: [{
                    model: ProductModel,
                    as: 'product' // Make sure this matches the alias in the association
                }]
            }]
        });

        if (!cart) {
            return res.status(404).send('Cart not found');
        }

        // Check if the cart belongs to the current user
        if (cart.userId !== req.user.userId) {
            return res.status(403).send('Access denied');
        }

        return res.json(cart);
    } catch (error) {
        console.error('Error retrieving cart:', error);
        return res.status(500).send('Internal Server Error');
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
                include: [{model: ProductModel, as: 'product'}]
            }]
        });

        if (!cart) {
            return res.status(404).send('Cart not found');
        }

        // Assuming you are inside the checkout logic
        let totalPrice = cart.items.reduce((total, item) => {
            // Access the raw numeric value of the price
            const rawPrice = item.product.getDataValue('price');
            console.log(`Raw Price: ${rawPrice}`); // For debugging, should show the numeric value
            const itemPrice = parseFloat(rawPrice);
            return total + (item.quantity * itemPrice);
        }, 0);

        console.log(`Total Price: ${totalPrice}`); // Should now correctly show the total price as a number


        // Create the Order with totalPrice
        const order = await OrderModel.create({
            userId: req.user.userId,
            totalPrice, // This should be a numeric value by this point
            status: 'completed',
            // other fields...
        });

        // Create order details for each cart item
        await Promise.all(cart.items.map(async (item) => {
            await OrderDetailModel.create({
                orderId: order.orderId,
                productId: item.productId,
                quantity: item.quantity,
                price: parseFloat(item.product.price) // Assume price is stored in the Product model; adjust as necessary
            });
        }));

        // Optionally, clear the cart after checkout
        await CartItemModel.destroy({where: {cartId}});

        const formattedTotalPrice = isNaN(totalPrice) ? "£0.00" : `£${totalPrice.toFixed(2)}`;

        const response = {
            ...order.get({plain: true}),
            totalPrice: formattedTotalPrice,
        };

        return res.status(201).json(response);

    } catch (error) {
        console.error('Error processing checkout:', error);
        return res.status(500).send('Internal Server Error');
    }
}

module.exports = {createCart, addProductToCart, getCartContentByID, cartCheckout}