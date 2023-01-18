import {IsNotEmpty, IsNumber, IsString, IsUrl, Max, Min} from 'class-validator';
export class RegaloDto {

    /**
     * Representa el nombre del regalo.
     * Los decoradores indican que es un string y que no puede ser vacio
     */
     @IsString()
     @IsNotEmpty()
     readonly nombre: string;

     /**
     * Representa la descripcion del regalo.
     * Los decoradores indican que es un string y que no puede ser vacio
     */
    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;

    /**
     * Representa la imagen del regalo.
     * Los decoradores indican que es una URL y que no puede ser vacia
     */
    @IsNotEmpty()
    readonly imagen: string;

    /**
     * Representa el precio promedio del regalo.
     * Los decoradores indican que es numerico y que debe estar entre 0 y 5
     */
    @IsNumber()
    @Min(0)
    readonly precioPromedio: number;

    /**
     * Representa el genero de un regalo.
     * Los decoradores indican que es un string y que no puede ser vacio
     */
     @IsString()
     @IsNotEmpty()
     readonly genero: string;

    /**
     * Representa la calificacion promedio del regalo.
     * Los decoradores indican que es numerico y que debe estar entre 0 y 5
     */
    @IsNumber()
    @Min(0)
    @Max(5)
    readonly calificacionPromedio: number;

    /**
     * Representa la cantidad de regalos agregados.
     * Los decoradores indican que es numerico y que debe ser mayor a 0
     *  
    */
     @IsNumber()
     @Min(0)
     readonly cantidad: number;
}
