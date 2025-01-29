# XPE Challenge

A robust RESTful API service for order management built with Node.js, Express, and TypeORM.

## 📋 Table of Contents

- [Features](#features)
- [System Architecture](#system-architecture)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- RESTful API endpoints for order management
- TypeORM integration with SQLite database
- Request validation and error handling
- Comprehensive logging system
- Pagination support
- Unit and integration tests
- API documentation

## 🏗 System Architecture

### System Context Diagram (Level 1)

![System Context Diagram](./docs/XPE-Challenge%20-%20C4%20-%20Context%20Diagram%20(Level1).png)

*Figure 1: System Context diagram showing the high-level interactions*

### Container Diagram (Level 2)

![Container Diagram](./docs/XPE-Challenge%20-%20C4%20-%20Container%20Diagram%20(Level%202).png)

*Figure 2: Container diagram showing the internal architecture and components*

## 📌 Prerequisites

- Node.js (>= 20.x)

## 🚀 Getting Started

1. Clone the repository:

   ```sh
   git clone https://github.com/MaximilianoVeiga/xpe-challenge.git
   cd xpe-challenge
   ```

2. Install dependencies:

   ```sh
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:

   ```sh
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Build and start the application:

   ```sh
   npm run build && npm start
   # or
   yarn build && yarn start
   ```

## 🔑 Environment Variables

```env
NODE_ENV=development
PORT=3000
```

## 📁 Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── models/        # Database entities
├── repositories/  # Data access layer
├── routes/        # API routes
├── services/      # Business logic
├── helpers/       # Utility functions
tests/             # Test files
```

## 📚 API Documentation

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /orders | Create new order |
| GET | /orders | List all orders |
| GET | /orders/:id | Get order by ID |
| PUT | /orders/:id | Update order |
| DELETE | /orders/:id | Delete order |
| GET | /orders/count/all/orders | Get total orders |
| GET | /orders/customerName/:name | Search by customer |

### Request Examples

#### Create Order

```json
POST /orders
{
  "orderNumber": "ORD001",
  "customerName": "John Doe",
  "totalValue": 99.99
}
```

#### Update Order

```json
PUT /orders/1
{
  "totalValue": 149.99
}
```

## 🧪 Testing

```sh
# Run all tests
npm test

# Run specific test suite
npm test -- orders.test.ts

# Run with coverage
npm run test:coverage
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
