import { IsDateString, IsNotEmpty } from "class-validator";

export class CarritoDto {
    @IsNotEmpty()
    @IsDateString({ strict: true } as any)
    readonly fechaCreacion: Date;
}