import { WishlistEntity } from '../wishlist/wishlist.entity';
import { TiendaEntity } from '../tienda/tienda.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, OneToMany } from 'typeorm';
import { CategoriaEntity } from '../categoria/categoria.entity';
import { CarritoEntity } from '../carrito/carrito.entity';

import { ResenaEntity } from '../resena/resena.entity';

/**
 * Esta clase representa una entidad de Regalo.
 * Un regalo tiene un id, un nombre, una descripcion, una imagen, un precio promedio, un genero y una calificacion promedio.
 * Un regalo pertenece a una wishlist (ManyToOne).
 * Los regalos pueden ser vendidos en muchas tiendas (ManyToMany).
 * Los regalos pueden tener muchas categorias asociadas (ManyToMany).
 */
@Entity()
export class RegaloEntity {
    // Este atributo representa el id del regalo
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Este atributo representa el nombre del regalo
    @Column()
    nombre: string;

    // Este atributo representa la descripcion del regalo
    @Column()
    descripcion: string;

    // Este atributo representa la ruta de la imagen del regalo
    @Column()
    imagen: string;

    // Este atributo representa el precio promedio del regalo
    // Se debe usar el tipo: real para que la BD NO lo almacene como entero
    @Column({type: 'real'})
    precioPromedio: number;
    
    // Este atributo representa el genero de un regalo
    @Column()
    genero: string;

    // Este atributo representa la calificacion promedio de un regalo
    // Se debe usar el tipo: real para que la BD NO lo almacene como entero
    @Column({type: 'real'})
    calificacionPromedio: number;

    @Column({nullable: true, type: 'int'})
    cantidad: number;

    // Esta relacion representa la wishlist a la que pertenece un regalo (ManyToOne)
    @ManyToOne(() => WishlistEntity, wishlist => wishlist.regalos)
    wishlist: WishlistEntity;

    @ManyToOne(() => CarritoEntity, carrito => carrito.regalos)
    carrito: CarritoEntity;

    // Esta relacion representa las tiendas en las que se venden los regalos (ManyToMany)
    @ManyToMany(() => TiendaEntity, tienda => tienda.regalos)
    tiendas: TiendaEntity[];

    // Esta relacion representa las categorias que tienen los regalos (ManyToMany)
    @ManyToMany(() => CategoriaEntity, categoria => categoria.regalos)
    categorias: CategoriaEntity[];

    // Esta relacion representa las reseñas que tiene el regalo (OneToMany)
    @OneToMany(()=> ResenaEntity, resenas =>resenas.regalo)
    resenas: ResenaEntity[];
}
