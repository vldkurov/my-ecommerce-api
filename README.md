# Users

Create a User (Registration)
POST /api/users - Register a new user.
Retrieve a User
GET /api/users/:userId - Get details of a specific user.
Update a User
PUT /api/users/:userId - Update user information.
Delete a User
DELETE /api/users/:userId - Delete a user account.
User Login
POST /api/users/login - Authenticate a user and return a token.

# Products

Create a Product
POST /api/products - Add a new product to the catalog.
Retrieve Products
GET /api/products - List all products. Support for pagination, filtering, and sorting could be included.
GET /api/products/:productId - Retrieve details of a specific product.
Update a Product
PUT /api/products/:productId - Update details of an existing product.
Delete a Product
DELETE /api/products/:productId - Remove a product from the catalog.

# Carts

Create a Cart for a User
POST /api/carts - Create a new shopping cart.
Retrieve a Cart
GET /api/carts/:cartId - Retrieve the contents of a specific cart.
Add Product to Cart
POST /api/carts/:cartId/items - Add a product to the cart.
Update Quantity of a Cart Item
PUT /api/carts/:cartId/items/:itemId - Update the quantity of an item in the cart.
Remove Product from Cart
DELETE /api/carts/:cartId/items/:itemId - Remove an item from the cart.

# Orders

Create an Order from a Cart
POST /api/orders - Create a new order from a cart.
Retrieve Orders for a User
GET /api/orders - Get a list of orders made by a user.
GET /api/orders/:orderId - Get details of a specific order.
Update an Order Status
PUT /api/orders/:orderId - Update the status of an order (e.g., from "pending" to "shipped").
Delete an Order
DELETE /api/orders/:orderId - Cancel an order.