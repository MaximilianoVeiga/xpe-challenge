import request from 'supertest';
import app from '../src/app';
import { Order } from '../src/models/order.entity';
import { AppDataSource, initializeDatabase } from '../src/config/database';

process.env.NODE_ENV = 'test';

const createTestOrder = (data = {}) => {
  return {
    orderNumber: 'TEST-001',
    customerName: 'Test Customer',
    totalValue: 100,
    ...data,
  };
};

describe('Order API', () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  beforeEach(async () => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.delete(Order, {});
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  });

  describe('POST /orders', () => {
    it('should create a new order with valid data', async () => {
      const orderData = createTestOrder();
      const response = await request(app).post('/orders').send(orderData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.orderNumber).toBe(orderData.orderNumber);
    });

    it('should return 400 when orderNumber is missing', async () => {
      const invalidOrder = {
        customerName: 'Test Customer',
        totalValue: 100,
      };
      const response = await request(app).post('/orders').send(invalidOrder);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should return 400 when totalValue is not numeric', async () => {
      const invalidOrder = createTestOrder({ totalValue: 'invalid' });
      const response = await request(app).post('/orders').send(invalidOrder);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /orders', () => {
    beforeEach(async () => {
      await AppDataSource.transaction(async (transactionalEntityManager) => {
        const orders = [
          createTestOrder({ orderNumber: 'TEST-001', customerName: 'John' }),
          createTestOrder({ orderNumber: 'TEST-002', customerName: 'Jane' }),
          createTestOrder({ orderNumber: 'TEST-003', customerName: 'John' }),
        ];

        for (const order of orders) {
          await transactionalEntityManager.save(Order, order);
        }
      });
    });

    it('should return paginated orders', async () => {
      await request(app)
        .post('/orders')
        .send(createTestOrder({ orderNumber: 'TEST-001' }));
      await request(app)
        .post('/orders')
        .send(createTestOrder({ orderNumber: 'TEST-002' }));

      const response = await request(app).get('/orders?page=1&limit=2');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('currentPage', 1);
      expect(Array.isArray(response.body.data)).toBeTruthy();
    });

    it('should handle pagination with invalid parameters', async () => {
      const response = await request(app).get('/orders?page=-1&limit=0');
      expect(response.status).toBe(200);
      expect(response.body.currentPage).toBe(1);
      expect(response.body.data).toBeDefined();
    });

    it('should return order by ID', async () => {
      const orderData = createTestOrder({ customerName: 'Find Me' });
      const { body: createdOrder } = await request(app)
        .post('/orders')
        .send(orderData);

      const response = await request(app).get(`/orders/${createdOrder.id}`);

      expect(response.status).toBe(200);
      expect(response.body.customerName).toBe(orderData.customerName);
    });

    it('should find orders by customer name', async () => {
      const response = await request(app).get('/orders/customerName/John');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();

      const johnOrders = response.body;
      expect(johnOrders.length).toBe(2);
      expect(
        johnOrders.every(
          (order: Order) => order.customerName.toLowerCase() === 'john',
        ),
      ).toBeTruthy();
    });

    it('should return empty array for non-existent customer name', async () => {
      const response = await request(app).get(
        '/orders/customerName/NonExistent',
      );
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBe(0);
    });

    it('should return correct count of orders', async () => {
      const response = await request(app).get('/orders/count/all/orders');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('total');
      expect(response.body.total).toBeGreaterThanOrEqual(3);
    });
  });

  describe('PUT /orders', () => {
    it('should update existing order', async () => {
      const { body: createdOrder } = await request(app)
        .post('/orders')
        .send(createTestOrder());

      const updateData = {
        orderNumber: 'UPDATED-001',
        customerName: 'Updated Customer',
        totalValue: 150,
      };

      const response = await request(app)
        .put(`/orders/${createdOrder.id}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.orderNumber).toBe(updateData.orderNumber);
      expect(response.body.customerName).toBe(updateData.customerName);
    });

    it('should return 404 when updating non-existent order', async () => {
      const response = await request(app)
        .put('/orders/999999')
        .send(createTestOrder());

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 when update data is invalid', async () => {
      const { body: createdOrder } = await request(app)
        .post('/orders')
        .send(createTestOrder());

      const invalidUpdate = {
        orderNumber: '',
        customerName: '',
        totalValue: 'invalid',
      };

      const response = await request(app)
        .put(`/orders/${createdOrder.id}`)
        .send(invalidUpdate);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('DELETE /orders', () => {
    it('should delete order and return 404 on subsequent fetch', async () => {
      const { body: createdOrder } = await request(app)
        .post('/orders')
        .send(createTestOrder());

      const deleteResponse = await request(app).delete(
        `/orders/${createdOrder.id}`,
      );
      expect(deleteResponse.status).toBe(204);

      const getResponse = await request(app).get(`/orders/${createdOrder.id}`);
      expect(getResponse.status).toBe(404);
    });

    it('should return 404 when deleting non-existent order', async () => {
      const response = await request(app).delete('/orders/999999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });
});
