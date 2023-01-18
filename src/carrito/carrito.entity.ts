/* eslint-disable prettier/prettier */
import { RegaloEntity } from '../regalo/regalo.entity';
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity';

/**
 * Esta clase representa una entidad de Carrito.
 * Un carrito tiene un id, un usuario y una lista de regalos.
 * Un carrito tiene un usuario (OneToOne).
 * Un carrito tiene muchos regalos (OneToMany).
 * */

@Entity()
export class CarritoEntity {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column()
 fechaCreacion: Date;

 @OneToMany(() => RegaloEntity, regalo => regalo.carrito)
 regalos: RegaloEntity[];

 @OneToOne(() => UsuarioEntity, usuario => usuario.carrito)
 usuario: UsuarioEntity
}