# XPE Challenge

This project is a simple API for managing orders using Node.js, Express, and TypeORM.

## Prerequisites

- Node.js (>= 14.x)
- npm or yarn

## Setup

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

3. Build the project:

   ```sh
   npm run build
   # or
   yarn build
   ```

## Running the Application

1. Start the development server:

   ```sh
   npm run dev
   # or
   yarn dev
   ```

2. The API will be available at `http://localhost:3000`.

## Running Tests

1. Run the tests:

   ```sh
   npm test
   # or
   yarn test
   ```

## API Endpoints

- `POST /orders` - Create a new order
- `GET /orders` - Get all orders (paginated)
- `GET /orders/:id` - Get order by ID
- `PUT /orders/:id` - Update an order
- `DELETE /orders/:id` - Delete an order
- `GET /orders/count/all/orders` - Get total count of orders
- `GET /orders/customerName/:name` - Get orders by customer name

## Postman Collection

A Postman collection is included in the `docs` folder. The collection contains pre-configured requests for all API endpoints with example payloads.

To use the collection:

1. Open Postman
2. Click "Import"
3. Select the file `docs/XPE Challenge.postman_collection.json`
4. All endpoints will be available under the "XPE Challenge" collection

## License

This project is licensed under the MIT License.
