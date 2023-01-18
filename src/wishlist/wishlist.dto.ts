import {IsNotEmpty, IsString, IsUrl} from 'class-validator';

export class WishlistDto {

    /**
     * Representa el nombre de la wishlist.
     * Los decoradores indican que es un string y que no puede ser vacio
     */
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    /**
     * Representa la descripcion de la wishlist.
     * Los decoradores indican que es un string y que no puede ser vacio
     */
    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;

    /**
     * Representa la imagen de la wishlist.
     * Los decoradores indican que es una URL y que no puede ser vacia
     */
    @IsNotEmpty()
    readonly imagen: string;
    
}
