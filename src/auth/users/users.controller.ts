import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users') // Esto significa que todas las rutas de este archivo van a empezar con /users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post() // Escucha peticiones HTTP POST a '/users' (para registrar un trabajador)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get() // Escucha peticiones HTTP GET a '/users' (para listar todos los trabajadores)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id') // Escucha peticiones HTTP GET a '/users/:id' (para buscar un trabajador por su ID)
  // Usamos ParseUUIDPipe para asegurarnos de que el ID que nos pasan sea un UUID válido antes de buscarlo
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }
}
