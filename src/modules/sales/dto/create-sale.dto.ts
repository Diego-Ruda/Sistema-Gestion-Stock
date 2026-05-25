import { IsNotEmpty, IsInt, IsPositive, IsUUID } from 'class-validator';

export class CreateSaleDto {
  @IsUUID('4', { message: 'El productId debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID del producto es obligatorio para la venta' })
  productId: string;

  @IsUUID('4', { message: 'El employeeId debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID del empleado es obligatorio para la venta' })
  employeeId: string;

  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @IsPositive({ message: 'La cantidad a vender debe ser mayor a 0' })
  quantity: number;
}
