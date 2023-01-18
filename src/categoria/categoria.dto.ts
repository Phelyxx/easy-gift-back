import {IsNotEmpty, IsString} from 'class-validator';
/* 
    * Representa la categoria de un regalo.
    * Los decoradores indican que es un string y que no puede ser vacio
    *   
* */
   
export class CategoriaDto {

 @IsString()
 @IsNotEmpty()
 readonly nombre: string;
}