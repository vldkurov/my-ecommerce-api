// Utility function to calculate total price of an order
const calculateTotalPrice = (orderDetails) => {
    return orderDetails.reduce((total, detail) => {
        const numericPrice = parseFloat(detail.Product.price.replace(/[^\d.-]/g, ''));
        return total + (!isNaN(numericPrice) ? numericPrice * detail.quantity : 0);
    }, 0);
};

module.exports = calculateTotalPrice