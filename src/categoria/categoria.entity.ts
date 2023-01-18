/* eslint-disable prettier/prettier */
import { RegaloEntity } from '../regalo/regalo.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity';


export enum TipoCategoria {
    MODA = "moda",
    JOYERIA = "joyeria",
    DEPORTES = "deportes",
    LIBROS = "libros",
    TECNOLOGIA = "tecnologia",
    JUGUETES = "juguetes",
  }

@Entity()
export class CategoriaEntity {

 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column()
 nombre: string;

 // Representa la asociación de los regalos que tiene una categoria.
 @ManyToMany(() => RegaloEntity, regalo => regalo.categorias)
 @JoinTable()
 regalos: RegaloEntity[];

 @ManyToMany(() => UsuarioEntity, usuario => usuario.intereses)
 @JoinTable()
 usuarios: UsuarioEntity[];
}
