/* eslint-disable prettier/prettier */
import { TiendaEntity } from '../tienda/tienda.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LocalizacionEntity {

 @PrimaryGeneratedColumn('uuid')
 id: string;

 //Representa la latitud de una localización puntual. 
 @Column({type: 'real'})
 latitud: number;
 
 //Representa la longitud de una localización puntual.
 @Column({type: 'real'})
 longitud: number;
 
 //Representa la dirección de la localización.
 @Column()
 direccion: string;


//Representa la ciudad donde se encuentra la localización. 
 @Column()
 ciudad: string;
 
//Representa el país donde se encuentra la localización. 
 @Column()
 pais: string;

 //Codigo postal de la localización
 @Column()
 codigoPostal: string;

 //Codigo postal de la localización
 @Column()
 esActual: boolean;

 // Asociación tienda->ubicacion, mapeada por tienda
 @OneToOne(() => TiendaEntity, tienda => tienda.ubicacion)
 tienda: TiendaEntity;

 
 // Representa la asociación de las direcciones que puede tener un usuario.
 @ManyToOne(() => UsuarioEntity, usuario => usuario.direcciones)
 usuario: UsuarioEntity;

}
