/* eslint-disable prettier/prettier */
import { UsuarioEntity } from '../usuario/usuario.entity';
import { RegaloEntity } from '../regalo/regalo.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';



@Entity()
export class ResenaEntity {
@PrimaryGeneratedColumn('uuid')
id: string;

@Column()
titulo: string;

@Column()
descripcion: string;

@Column()
fecha: Date;

@Column()
calificacion: number;

@ManyToOne(()=> UsuarioEntity, usuario => usuario.resenas)
usuario: UsuarioEntity;

@ManyToOne(()=> RegaloEntity, regalo => regalo.resenas)
regalo: RegaloEntity;


}
