import { Order } from '../models/order.entity';
import { OrderRepository } from '../repositories/order.repository';

/**
 * Service class for handling order-related business logic
 */
export class OrderService {
  private readonly orderRepository: OrderRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
  }

  get repository(): OrderRepository {
    return this.orderRepository;
  }

  /**
   * Creates a new order
   * @param data - Partial order data
   * @returns Promise resolving to the created order
   */
  async createOrder(data: Partial<Order>): Promise<Order> {
    return this.orderRepository.create(data);
  }

  /**
   * Retrieves all orders
   * @returns Promise resolving to an array of orders
   */
  async findAll(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }

  /**
   * Finds an order by its ID
   * @param id - The order ID to search for
   * @returns Promise resolving to the found order or null
   */
  async findById(id: number): Promise<Order | null> {
    return this.orderRepository.findById(id);
  }

  /**
   * Finds orders by customer name
   * @param name - The customer name to search for
   * @returns Promise resolving to an array of matching orders
   */
  async findByCustomerName(name: string): Promise<Order[]> {
    return this.orderRepository.findByCustomerName(name);
  }

  /**
   * Updates an existing order
   * @param id - The ID of the order to update
   * @param data - The updated order data
   * @returns Promise resolving to the updated order or null
   */
  async updateOrder(id: number, data: Partial<Order>): Promise<Order | null> {
    const existingOrder = await this.orderRepository.findById(id);
    if (!existingOrder) return null;

    Object.assign(existingOrder, data);
    return this.orderRepository.update(existingOrder);
  }

  /**
   * Deletes an order
   * @param id - The ID of the order to delete
   * @returns Promise resolving to a boolean indicating success
   */
  async deleteOrder(id: number): Promise<boolean> {
    return this.orderRepository.delete(id);
  }

  /**
   * Counts total number of orders
   * @returns Promise resolving to the total count
   */
  async countOrders(): Promise<number> {
    return this.orderRepository.count();
  }
}
