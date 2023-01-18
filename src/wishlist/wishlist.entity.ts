/* eslint-disable prettier/prettier */
import { RegaloEntity } from '../regalo/regalo.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity';

/**
 * Esta clase representa una entidad de Wishlist.
 * Una wishlist tiene un id, un nombre, una descripcion, una imagen y muchos regalos (OneToMany)
 */
@Entity()
export class WishlistEntity {
    // Este atributo representa el id de la wishlist
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Este atributo representa el nombre de la wishlist
    @Column()
    nombre: string;

    // Este atributo representa la descripcion de la wishlist
    @Column()
    descripcion: string;

    // Este atributo representa la ruta de la imagen de la wishlist
    @Column()
    imagen: string;

    // Esta relacion representa los regalos de una wishlist (OneToMany)
    @OneToMany(() => RegaloEntity, regalo => regalo.wishlist)
    regalos: RegaloEntity[];

    // Esta relacion representa las wishlists de un usuario
    @ManyToOne(()=> UsuarioEntity, usuario => usuario.wishlist)
    usuario: UsuarioEntity;
}
