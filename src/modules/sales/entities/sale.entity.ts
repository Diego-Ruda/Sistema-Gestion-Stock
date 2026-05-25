import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../../auth/users/entities/user.entity';

@Entity({ name: 'sales' })
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @ManyToOne(() => Product, (product) => product.id, { eager: true })
  product: Product;

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  employee: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
