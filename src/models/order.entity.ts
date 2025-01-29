/**
 * Represents an order entity in the system
 * @entity Order
 */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Order {
  /** Unique identifier for the order */
  @PrimaryGeneratedColumn()
  id!: number;

  /** Order reference number */
  @Column()
  orderNumber!: string;

  /** Name of the customer who placed the order */
  @Column()
  customerName!: string;

  /** Total monetary value of the order */
  @Column('decimal')
  totalValue!: number;
}
