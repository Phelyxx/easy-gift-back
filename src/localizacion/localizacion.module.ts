/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalizacionEntity } from './localizacion.entity';
import { LocalizacionService } from './localizacion.service';
import { LocalizacionController } from './localizacion.controller';

import { JwtService } from '@nestjs/jwt';

@Module({
    imports:[TypeOrmModule.forFeature([LocalizacionEntity])],
    providers: [LocalizacionService,JwtService],
    controllers: [LocalizacionController,]
})
export class LocalizacionModule {

}
