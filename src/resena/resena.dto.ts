/* eslint-disable prettier/prettier */

import { IsDateString, IsNotEmpty, IsNumber, IsString,} from 'class-validator';
export class ResenaDto {

    
    @IsString()
    @IsNotEmpty()
    titulo: string;

    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @IsDateString()
    @IsNotEmpty()
    fecha: Date;

    @IsNumber()
    @IsNotEmpty()
    calificacion: number;


}
