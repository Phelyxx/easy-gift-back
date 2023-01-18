import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalizacionEntity } from '../localizacion/localizacion.entity';
import { TiendaEntity } from '../tienda/tienda.entity';
import { TiendaLocalizacionService } from './tienda-localizacion.service';
import { TiendaLocalizacionController } from './tienda-localizacion.controller';

import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [TiendaLocalizacionService, JwtService],
  imports: [TypeOrmModule.forFeature([TiendaEntity, LocalizacionEntity])],
  controllers: [TiendaLocalizacionController],
})
export class TiendaLocalizacionModule {}


