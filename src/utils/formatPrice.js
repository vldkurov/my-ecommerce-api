// Utility function to format price from string to "£XX.XX" format
const formatPrice = (price) => {
    const numericPrice = parseFloat(price.replace(/[^\d.-]/g, ''));
    return !isNaN(numericPrice) ? `£${numericPrice.toFixed(2)}` : "Invalid Price";
};

module.exports = formatPrice