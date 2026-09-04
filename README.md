# Aqua Distribution App - Full Stack

A comprehensive web and mobile application for water distribution and promotion business with role-based dashboards, GPS tracking, and sales analytics.

## Features

### Representative Dashboard
- Sales overview (targets vs achieved crates)
- Customer management (existing or add new)
- New customer entry with photo capture
- Incentive tracking (₹25 for new customers with ≥5 crates)
- Order placement with product catalogue
- Performance tracking (weekly/monthly graphs)
- Live GPS location tracking + route history
- Push notifications

### Admin Dashboard
- Global sales overview (consolidated crates, revenue, profit)
- Representative management (add/remove/assign targets)
- Order monitoring (pending/delivered status)
- Customer verification with photo approval
- Advanced analytics (brand split, district-wise sales)
- Cash-flow projection
- Growth roadmap tracking
- Live GPS tracking of representatives
- Comprehensive notifications

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT + bcrypt
- **File Storage**: AWS S3 / Local Storage
- **GPS Tracking**: Real-time socket integration

### Frontend (Web)
- **Framework**: React 18
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI / Tailwind CSS
- **Charts**: Recharts
- **Maps**: Leaflet / Google Maps
- **HTTP Client**: Axios

### Mobile App
- **Framework**: React Native (Expo)
- **State Management**: Redux Toolkit
- **Maps & GPS**: react-native-geolocation, react-native-maps
- **Camera**: expo-camera
- **File Upload**: expo-image-picker

## Project Structure

```
aqua-distribution-app/
├── backend/                    # Node.js + Express backend
│   ├── src/
│   │   ├── config/            # Database, auth config
│   │   ├── controllers/       # Request handlers
│   │   ├── models/            # Database models
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Auth, validation
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Helper functions
│   │   └── app.js             # Express app setup
│   ├── .env.example
│   ├── package.json
│   └── server.js              # Entry point
│
├── web/                        # React web frontend
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── store/             # Redux store
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API calls
│   │   ├── styles/            # CSS/SCSS
│   │   └── App.js
│   ├── package.json
│   └── .env.example
│
├── mobile/                     # React Native mobile app
│   ├── app/                   # Expo router app
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── screens/           # Screen components
│   │   ├── store/             # Redux store
│   │   ├── services/          # API calls
│   │   ├── utils/             # Helpers
│   │   └── navigation/        # Navigation config
│   ├── app.json               # Expo config
│   ├── package.json
│   └── .env.example
│
├── docs/                       # Documentation
│   ├── API.md                 # API documentation
│   ├── DEPLOYMENT.md          # Deployment guide
│   ├── DATABASE.md            # Database schema
│   └── SETUP.md               # Local setup guide
│
└── docker-compose.yml         # Docker setup (optional)
```

## Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- PostgreSQL 12+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/avikarmakar4-maker/aqua-distribution-app.git
   cd aqua-distribution-app
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure your .env file
   npm run migrate
   npm start
   ```

3. **Web Frontend Setup**
   ```bash
   cd ../web
   npm install
   cp .env.example .env
   # Configure your .env file
   npm start
   ```

4. **Mobile App Setup**
   ```bash
   cd ../mobile
   npm install
   cp .env.example .env
   # Configure your .env file
   npx expo start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token

### Representatives
- `GET /api/representatives` - List all reps (Admin only)
- `POST /api/representatives` - Add new rep (Admin only)
- `PUT /api/representatives/:id` - Update rep details
- `DELETE /api/representatives/:id` - Remove rep (Admin only)

### Customers
- `GET /api/customers` - List customers for rep
- `POST /api/customers` - Create new customer
- `GET /api/customers/pending` - Pending verification (Admin)
- `PUT /api/customers/:id/verify` - Verify customer (Admin)

### Orders
- `GET /api/orders` - List orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status
- `GET /api/orders/analytics` - Order analytics

### Incentives
- `GET /api/incentives` - List incentives for rep
- `POST /api/incentives/claim` - Claim incentive
- `PUT /api/incentives/:id/approve` - Approve incentive (Admin)

### GPS Tracking
- `POST /api/location/track` - Record location
- `GET /api/location/history/:repId` - Get route history
- `GET /api/location/live` - Get live rep locations (Admin)

### Analytics
- `GET /api/analytics/sales` - Sales analytics
- `GET /api/analytics/revenue` - Revenue analytics
- `GET /api/analytics/district` - District-wise analytics

## Database Schema

See `docs/DATABASE.md` for complete schema documentation.

### Key Tables
- **users** - Representatives and Admins
- **customers** - Customer information with verification status
- **products** - Product catalogue
- **orders** - Order records with status
- **incentives** - Incentive claims and approvals
- **locations** - GPS location tracking
- **notifications** - Push notifications

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/aqua_db
JWT_SECRET=your-secret-key
JWT_EXPIRY=7d
AWS_S3_BUCKET=your-bucket
AWS_REGION=us-east-1
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_MAPS_KEY=your-api-key
```

### Mobile (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_MAPS_KEY=your-api-key
```

## Deployment

See `docs/DEPLOYMENT.md` for:
- Docker containerization
- Heroku deployment
- AWS deployment
- Mobile app build and release

## Product Catalogue

1. Aquinne 300 Ml
2. Aquinne 500 Ml
3. Aquinne 1 Ltr
4. Aquinne 2 Ltrs
5. Aqua Diamond 500 Ml
6. Aqua Diamond 1 Ltr
7. Aqua Diamond 2 Ltrs
8. Aqua Diamond 5 Ltrs
9. Aqua Diamond 20 Ltrs
10. Amrut 20 Ltrs

## Incentive Logic

- **New Customer Incentive**: ₹25 credited to representative only if:
  - Customer is newly verified
  - Customer's first order is ≥ 5 crates
  - Order is successfully delivered

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For support, email support@aquadistribution.com or open an issue on GitHub.

## Roadmap

- [ ] Payment gateway integration
- [ ] SMS/Email notifications
- [ ] Advanced analytics dashboard
- [ ] Inventory management
- [ ] Supply chain tracking
- [ ] Multi-language support
