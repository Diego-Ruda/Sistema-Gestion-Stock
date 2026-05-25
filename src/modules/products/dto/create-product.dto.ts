import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  IsInt,
  Min,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'El nombre del producto debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre del producto no puede estar vacío' })
  @MaxLength(150, {
    message: 'El nombre del producto no puede superar los 150 caracteres',
  })
  name: string;

  @IsNumber({}, { message: 'El precio debe ser un número válido' })
  @IsPositive({ message: 'El precio debe ser un número mayor a 0' })
  price: number;

  @IsInt({ message: 'El stock debe ser un número entero' })
  @Min(0, { message: 'El stock mínimo no puede ser menor a 0' })
  stock: number;

  @IsUUID('4', { message: 'El categoryId debe ser un ID único (UUID) válido' })
  @IsNotEmpty({
    message: 'La categoría es obligatoria para registrar un producto',
  })
  categoryId: string;
}
