import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsIn,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'El formato del email no es válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;

  @IsString({ message: 'La contraseña debe ser un texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string;

  @IsString()
  @IsOptional()
  @IsIn(['ADMIN', 'EMPLEADO'], { message: 'El rol debe ser ADMIN o EMPLEADO' })
  role?: string;
}
