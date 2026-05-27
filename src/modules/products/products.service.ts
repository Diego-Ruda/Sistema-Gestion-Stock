import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

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
  async remove(id: string) {
    // 1 Buscamos el producto en el DB
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`El producto con ID ${id} no existe`);
    }
    // 2 Cambiamos su estado a false
    product.isActive = false;

    // 3 Guardamos el producto con el estado
    await this.productRepository.save(product);

    return {
      message: `El producto "${product.name}" fue dado de baja (desactivado) correctamente`,
    };
  }

  async activate(id: string) {
    // 1 Buscamos el producto en el DB
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`El producto con ID ${id} no existe`);
    }

    // 2 cambiamossu estado en true
    product.isActive = true;

    // 3 guardamos el producto con el estado
    await this.productRepository.save(product);

    return {
      message: `El producto "${product.name}" fue dado de alta (activo) correctamente`,
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    // 1 Buscando el producto si existe en la DB
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`El prodcuto con la ID ${id} no existe`);
    }

    // 2 Fusionamos los cambios que vamos a mandar
    const updatedProduct = Object.assign(product, updateProductDto);

    // 3 Guardamos los cambios en la DB
    return await this.productRepository.save(updatedProduct);
  }
}
