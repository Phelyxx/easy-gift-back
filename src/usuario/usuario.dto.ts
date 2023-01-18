import {IsNotEmpty, IsString, IsUrl, IsDate, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
export class UsuarioDto {


    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    readonly bio: string;

    @IsString()
    @IsNotEmpty()
    readonly usuario: string;

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    readonly cumpleanios: Date;

    @IsNumber()
    @Min(0)
    readonly edad: number;

    @IsUrl()
    readonly rutaFotoPerfil: string;

    @IsUrl()
    readonly rutaFotoPortada: string;

    @IsString()
    @IsNotEmpty()
    readonly genero: string;

    @IsNumber()
    @Min(0)
    readonly presupuesto: number;

    @IsString()
    readonly disponibilidadDeTiempo: string;



}
