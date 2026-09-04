# Aqua Distribution Backend API

A comprehensive backend API for managing aqua water distribution operations, built with Express.js and Sequelize ORM.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Order Management**: Create and manage customer orders with crate tracking
- **Customer Management**: Register and manage customers with verification workflow
- **Product Catalog**: Manage product inventory with pricing and cost information
- **Incentive System**: Track and approve incentives for sales representatives
- **Location Tracking**: GPS-based location tracking for field representatives
- **Analytics**: Real-time sales, revenue, and performance analytics
- **Notifications**: In-app notification system for important updates
- **Representative Management**: Manage sales representatives and their performance metrics

## Technology Stack

- **Framework**: Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, bcryptjs
- **Additional**: Morgan (logging), UUID, Socket.io (optional)

## Installation

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MySQL Server

### Setup Steps

1. Clone the repository
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your database and server configuration
```

4. Start the server
```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm start
```

## API Routes

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh JWT token

### Products
- `GET /api/v1/products` - Get all products
- `POST /api/v1/products` - Create new product (admin)
- `GET /api/v1/products/:id` - Get product details
- `PUT /api/v1/products/:id` - Update product (admin)

### Customers
- `GET /api/v1/customers` - Get customers
- `POST /api/v1/customers` - Register new customer
- `GET /api/v1/customers/:id` - Get customer details
- `PUT /api/v1/customers/:id/verify` - Verify customer (admin)

### Orders
- `GET /api/v1/orders` - Get orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders/:id` - Get order details
- `PUT /api/v1/orders/:id` - Update order status (admin)

### Incentives
- `GET /api/v1/incentives` - Get incentives
- `POST /api/v1/incentives/claim` - Claim incentive
- `PUT /api/v1/incentives/:id` - Approve/reject incentive (admin)

### Analytics
- `GET /api/v1/analytics/sales` - Get sales overview
- `GET /api/v1/analytics/revenue` - Get revenue analytics
- `GET /api/v1/analytics/brand` - Get brand-wise sales
- `GET /api/v1/analytics/district` - Get district-wise sales
- `GET /api/v1/analytics/representative` - Get rep performance
- `GET /api/v1/analytics/cashflow` - Get cash flow projection

### Notifications
- `GET /api/v1/notifications` - Get notifications
- `PUT /api/v1/notifications/:id/read` - Mark as read
- `PUT /api/v1/notifications/read-all` - Mark all as read

### Locations
- `POST /api/v1/locations/track` - Record location
- `GET /api/v1/locations/history/:repId` - Get location history
- `GET /api/v1/locations/live/all` - Get all reps live location (admin)

### Representatives
- `GET /api/v1/representatives` - Get all reps (admin)
- `GET /api/v1/representatives/:id` - Get rep details
- `GET /api/v1/representatives/:id/customers` - Get rep's customers
- `GET /api/v1/representatives/:id/orders` - Get rep's orders

## Database Schema

The application uses the following main entities:

- **Users**: System users (admin, representatives)
- **Products**: Water products with pricing information
- **Customers**: End customers for distribution
- **Orders**: Sales orders with crate tracking
- **Incentives**: Sales incentives and commissions
- **Locations**: GPS coordinates for field tracking
- **Notifications**: User notifications

## Authentication

All protected routes require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message"
}
```

## Development

### Running in Development Mode
```bash
npm run dev
```

### Running Tests
```bash
npm test
```

## Security

- Passwords are hashed using bcryptjs
- JWT tokens have an expiry time
- CORS is configured for allowed origins
- Helmet.js is used for security headers
- Input validation on all endpoints

## License

MIT
