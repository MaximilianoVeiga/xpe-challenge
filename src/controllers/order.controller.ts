import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { OrderService } from '../services/order.service';
import { paginate } from '../helpers/pagination.helper';
import { logger } from '../config/logger';

const orderService = new OrderService();

/**
 * Controller handling HTTP requests for Order operations
 */
export class OrderController {
  /**
   * Creates a new order
   * @param req - Express request object containing order data
   * @param res - Express response object
   */
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { orderNumber, customerName, totalValue } = req.body;
      const newOrder = await orderService.createOrder({
        orderNumber,
        customerName,
        totalValue,
      });

      logger.info('Order created successfully', {
        orderId: newOrder.id,
        orderNumber,
        customerName,
        operation: 'create',
      });
      res.status(201).json(newOrder);
    } catch (error) {
      logger.error('Order creation failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        orderData: req.body,
        operation: 'create',
      });
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * Retrieves all orders with pagination
   * @param req - Express request object containing pagination parameters
   * @param res - Express response object
   */
  static async findAll(req: Request, res: Response): Promise<void> {
    try {
      if (!orderService.repository) {
        throw new Error('Database connection not available');
      }

      const allOrders = await orderService.findAll();

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const paginated = paginate(allOrders, page, limit);
      logger.info('Orders retrieved successfully', {
        page,
        limit,
        totalItems: allOrders.length,
        operation: 'findAll',
      });
      res.status(200).json(paginated);
    } catch (error) {
      logger.error('Failed to fetch orders', {
        error: error instanceof Error ? error.message : String(error),
        params: { page: req.query.page, limit: req.query.limit },
        operation: 'findAll',
      });
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * Retrieves an order by its ID
   * @param req - Express request object containing order ID
   * @param res - Express response object
   */
  static async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid ID format' });
        return;
      }

      const order = await orderService.findById(id);
      if (order === null) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }
      res.status(200).json(order);
    } catch (error) {
      logger.error('Error fetching order by id: ' + error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * Finds orders by customer name
   * @param req - Express request object containing customer name
   * @param res - Express response object
   */
  static async findByCustomerName(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.params;
      if (!name || name.trim().length === 0) {
        res.status(400).json({ error: 'Customer name is required' });
        return;
      }

      const orders = await orderService.findByCustomerName(name);

      logger.info(`Found ${orders.length} orders for customer: ${name}`);
      res.status(200).json(orders);
    } catch (error) {
      logger.error('Error fetching orders by name: ' + error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * Updates an existing order
   * @param req - Express request object containing updated order data
   * @param res - Express response object
   */
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const id = parseInt(req.params.id);
      const { orderNumber, customerName, totalValue } = req.body;
      const updatedOrder = await orderService.updateOrder(id, {
        orderNumber,
        customerName,
        totalValue,
      });

      if (!updatedOrder) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      logger.info(`Order updated: ${updatedOrder.id}`);
      res.status(200).json(updatedOrder);
    } catch (error) {
      logger.error('Error updating order: ' + error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * Deletes an order
   * @param req - Express request object containing order ID
   * @param res - Express response object
   */
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const success = await orderService.deleteOrder(id);
      if (!success) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      logger.info(`Order deleted: ${id}`);
      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting order: ' + error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * Counts total number of orders
   * @param req - Express request object
   * @param res - Express response object
   */
  static async count(req: Request, res: Response): Promise<void> {
    try {
      const total = await orderService.countOrders();
      res.status(200).json({ total });
    } catch (error) {
      logger.error('Error counting orders: ' + error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
