/* eslint-disable prettier/prettier */
import { CarritoEntity } from '../carrito/carrito.entity';
import { CategoriaEntity } from '../categoria/categoria.entity';
import { LocalizacionEntity } from '../localizacion/localizacion.entity';
import { ResenaEntity } from '../resena/resena.entity';
import { WishlistEntity } from '../wishlist/wishlist.entity';
import { Column, Entity, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, JoinColumn, JoinTable } from 'typeorm';

@Entity()
export class UsuarioEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    email: string;

    @Column()
    bio: string;

    @Column()
    usuario: string;

    @Column()
    cumpleanios: Date;

    @Column()
    edad: number;

    @Column()
    rutaFotoPerfil: string;

    @Column()
    rutaFotoPortada: string;

    @Column()
    genero: string;

    @Column()
    presupuesto: number;

    @Column()
    disponibilidadDeTiempo: string;


    // Representa las direcciones que puede tener un usuario.
    @OneToMany(() => LocalizacionEntity, localizacion => localizacion.usuario)
    direcciones: LocalizacionEntity[];


    @ManyToMany(() => UsuarioEntity, usuario => usuario.amigos)
    @JoinTable()
    amigos: UsuarioEntity[];


    @OneToOne(() => CarritoEntity, carrito => carrito.usuario)
    @JoinColumn()
    carrito: CarritoEntity
    


    @OneToMany(() => ResenaEntity, resena => resena.usuario)
    resenas: ResenaEntity[];

    @ManyToMany(()=>CategoriaEntity, categoria => categoria.usuarios)
    @JoinTable()
    intereses: CategoriaEntity[];
    

    @OneToMany(() => WishlistEntity, wishlist => wishlist.usuario)
    wishlist: WishlistEntity[];




}
