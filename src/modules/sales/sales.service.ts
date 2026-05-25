import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { Product } from '../products/entities/product.entity';
import { CreateSaleDto } from './dto/create-sale.dto';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createSaleDto: CreateSaleDto) {
    const { productId, employeeId, quantity } = createSaleDto;

    // Vamos a validar que el producto exista en la base de datos
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(
        `El producto con ID ${productId} no fue encontrado`,
      );
    }

    // Control Crítico de Stock: Verificar que alcancen las unidades
    if (product.stock < quantity) {
      throw new BadRequestException(
        `Stock insuficiente. Intentás vender ${quantity} unidades, pero solo quedan ${product.stock} de "${product.name}"`,
      );
    }

    //Calcula el total de la transacción automáticamente
    const totalSales = Number(product.price) * quantity;

    //Modifica y actualiza el stock del producto en la base de datos
    product.stock -= quantity;
    await this.productRepository.save(product);

    // Crear e impactar el registro histórico de la venta
    const newSale = this.saleRepository.create({
      quantity,
      total: totalSales,
      product: { id: productId },
      employee: { id: employeeId },
    });

    return await this.saleRepository.save(newSale);
  }

  async findAll() {
    return await this.saleRepository.find();
  }
}
