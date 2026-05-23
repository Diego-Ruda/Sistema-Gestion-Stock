import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'El nombre de la categoría debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre de la categoría no puede estar vacío' })
  @MaxLength(100, { message: 'El nombre no puede superar los 100 caracteres' })
  name: string;
}
