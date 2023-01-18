
import { IsNotEmpty, IsNumber, IsString, IsUrl } from "class-validator";

export class TiendaDto {
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;
 
    @IsString()
    @IsNotEmpty()
    readonly imagen: string;
 
    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;
 
    @IsUrl()
    @IsNotEmpty()
    readonly paginaWeb: string;
 
    @IsNumber()
    @IsNotEmpty()
    readonly telefono: number;
 }