import { Repository } from 'typeorm';
import { Order } from '../models/order.entity';
import { AppDataSource } from '../config/database';

/**
 * Repository class for handling order database operations
 */
export class OrderRepository {
  private readonly repository: Repository<Order>;

  constructor() {
    this.repository = AppDataSource.getRepository(Order);
  }

  /**
   * Creates a new order in the database
   * @param data - Partial order data
   * @returns Promise resolving to the created order
   */
  async create(data: Partial<Order>): Promise<Order> {
    const order = this.repository.create(data);
    return this.repository.save(order);
  }

  /**
   * Retrieves all orders from the database
   * @returns Promise resolving to an array of orders
   */
  async findAll(): Promise<Order[]> {
    return this.repository.find();
  }

  /**
   * Retrieves an order by its ID
   * @param id - Order ID
   * @returns Promise resolving to the order or null if not found
   */
  async findById(id: number): Promise<Order | null> {
    return this.repository.findOneBy({ id });
  }

  /**
   * Retrieves orders by customer name
   * @param name - Customer name
   * @returns Promise resolving to an array of orders
   */
  async findByCustomerName(name: string): Promise<Order[]> {
    return this.repository
      .createQueryBuilder('order')
      .where('LOWER(order.customerName) = LOWER(:name)', { name })
      .getMany();
  }

  /**
   * Updates an existing order in the database
   * @param order - Order to update
   * @returns Promise resolving to the updated order
   */
  async update(order: Order): Promise<Order> {
    return this.repository.save(order);
  }

  /**
   * Deletes an order by its ID
   * @param id - Order ID
   * @returns Promise resolving to a boolean indicating success
   */
  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  /**
   * Counts the total number of orders in the database
   * @returns Promise resolving to the total number of orders
   */
  async count(): Promise<number> {
    return this.repository.count();
  }
}
