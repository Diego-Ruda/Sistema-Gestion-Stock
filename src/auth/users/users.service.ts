import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  // Con esto "inyectamos" la tabla de usuarios para usarla acá adentro
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 1. Método para registrar un nuevo trabajador (User)
  async create(createUserDto: CreateUserDto) {
    const { email, password, role } = createUserDto;

    // Verificamos si ya existe un trabajador con ese mismo email
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException(
        'Este email ya está registrado en el sistema',
      );
    }
    //El encriptado
    const hashedPassword = await bcrypt.hash(password, 10);
    // Creamos la instancia del nuevo usuario
    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      role,
    });

    // Lo guardamos definitivamente en PostgreSQL
    return await this.userRepository.save(newUser);
  }

  // 2. Método para listar a todos los trabajadores
  async findAll() {
    return await this.userRepository.find();
  }

  // 3. Método para buscar un trabajador específico por su ID
  async findOne(id: string) {
    return await this.userRepository.findOne({ where: { id } });
  }
}
