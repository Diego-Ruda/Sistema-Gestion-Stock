import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { name } = createCategoryDto;

    // Pasamos el nombre a mayúsculas para evitar duplicados tipo "bebidas" y "Bebidas"
    const normalizedName = name.trim().toUpperCase();

    const existingCategory = await this.categoryRepository.findOne({
      where: { name: normalizedName },
    });

    if (existingCategory) {
      throw new ConflictException(
        `La categoría "${name}" ya existe en el sistema`,
      );
    }

    const newCategory = this.categoryRepository.create({
      name: normalizedName,
    });

    return await this.categoryRepository.save(newCategory);
  }

  async findAll() {
    return await this.categoryRepository.find({
      where: { isActive: true }, // Solo traemos las categorías activas
    });
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(
        `La categoría con ID ${id} no fue encontrada`,
      );
    }
    return category;
  }
}
