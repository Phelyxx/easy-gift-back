
/* eslint-disable prettier/prettier */
import { LocalizacionEntity } from '../localizacion/localizacion.entity';
import { RegaloEntity } from '../regalo/regalo.entity';
import { Column, Entity,JoinColumn, JoinTable, ManyToMany, OneToOne,  PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TiendaEntity {

 @PrimaryGeneratedColumn('uuid')
 id: string;

 //Representa el nombre de la tienda. 
 @Column()
 nombre: string;
 
 // Imagén representativa de la tienda.
 @Column()
 imagen: string;
 
 // Descripción de la tienda.
 @Column()
 descripcion: string;


// Contiene el url de la pagina web perteneciente a la tienda. 
 @Column()
 paginaWeb: string;
 
// Número telefónico de contacto de la tienda. 
 @Column()
 telefono: number;


 // Asociación tienda->ubicacion, mapeada por tienda
 @OneToOne(() => LocalizacionEntity, ubicacion => ubicacion.tienda)
 @JoinColumn()
 // Representa la ubicación de la tienda.
 ubicacion: LocalizacionEntity;

 // Representa la asociación de los regalos que tiene una tienda.
 @ManyToMany(() => RegaloEntity, regalo => regalo.tiendas)
 @JoinTable()
 regalos: RegaloEntity[];
}
