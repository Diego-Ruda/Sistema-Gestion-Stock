import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { name, price, stock, categoryId } = createProductDto;

    // Normalizamos el nombre para evitar duplicados exactos
    const normalizedName = name.trim().toUpperCase();

    const existingProduct = await this.productRepository.findOne({
      where: { name: normalizedName },
    });

    if (existingProduct) {
      throw new ConflictException(
        `El producto "${name}" ya existe en el stock`,
      );
    }

    // Creamos la estructura del producto asignándole el ID de la relación como un objeto
    const newProduct = this.productRepository.create({
      name: normalizedName,
      price,
      stock,
      category: { id: categoryId },
    });

    return await this.productRepository.save(newProduct);
  }

  async findAll() {
    return await this.productRepository.find({
      where: { isActive: true },
    });
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(
        `El producto con ID ${id} no existe en el stock`,
      );
    }
    return product;
  }
}
