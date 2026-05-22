import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users') // Esto le dice a Postgres que la tabla se va a llamar 'users'
export class User {
  @PrimaryGeneratedColumn('uuid') // Genera un ID único automático tipo UUID (más seguro que 1, 2, 3...)
  id: string;

  @Column({ unique: true }) // No puede haber dos usuarios con el mismo email
  email: string;

  @Column() // Acá va a ir la contraseña encriptada
  password: string;

  @Column({ default: 'EMPLEADO' }) // Por defecto, si no aclaramos, es EMPLEADO. Los valores válidos serán 'ADMIN' o 'EMPLEADO'
  role: string;

  @Column({ default: true }) // Para poder "desactivar" un usuario sin borrarlo de la base de datos (baja lógica)
  isActive: boolean;

  @CreateDateColumn() // Guarda la fecha exacta en la que se creó el usuario
  createdAt: Date;

  @UpdateDateColumn() // Modifica la fecha automáticamente si editamos el usuario
  updatedAt: Date;
}
