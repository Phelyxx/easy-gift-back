import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class LocalizacionDto {
   @IsNumber()
   @IsNotEmpty()
   readonly latitud: number;

   @IsNumber()
   @IsNotEmpty()
   readonly longitud: number;

   @IsString()
   @IsNotEmpty()
   readonly direccion: string;

   @IsString()
   @IsNotEmpty()
   readonly pais: string;

   @IsString()
   @IsNotEmpty()
   readonly codigoPostal: string;

   
   @IsBoolean()
   @IsNotEmpty()
   readonly esActual: boolean;
}