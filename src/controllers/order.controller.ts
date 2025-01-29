import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { OrderService } from '../services/order.service';
import { paginate } from '../helpers/pagination.helper';
import { logger } from '../config/logger';

/** @type {OrderService} Service instance for order operations */
const orderService = new OrderService();

/**
 * Controller handling HTTP requests for Order operations
 * @class OrderController
 * @classdesc Provides endpoints for CRUD operations on orders
 */
export class OrderController {
  /**
   * Creates a new order in the system
   * @param {Request} req - Express request object containing order data in the body
   * @param {Response} res - Express response object
   * @returns {Promise<void>}
   * @throws {Error} When order creation fails
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

      logger.info('Order created successfully');
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
   * Retrieves a paginated list of all orders
   * @param {Request} req - Express request with optional page and limit query parameters
   * @param {Response} res - Express response object
   * @returns {Promise<void>}
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
      logger.info('Orders retrieved successfully');
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
   * Retrieves a specific order by its ID
   * @param {Request} req - Express request with order ID parameter
   * @param {Response} res - Express response object
   * @returns {Promise<void>}
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
   * Finds all orders for a specific customer
   * @param {Request} req - Express request with customer name parameter
   * @param {Response} res - Express response object
   * @returns {Promise<void>}
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
   * @param {Request} req - Express request with order ID and updated data
   * @param {Response} res - Express response object
   * @returns {Promise<void>}
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
   * Deletes an order from the system
   * @param {Request} req - Express request with order ID parameter
   * @param {Response} res - Express response object
   * @returns {Promise<void>}
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
   * Retrieves the total count of orders in the system
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>}
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
