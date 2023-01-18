import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegaloEntity } from '../regalo/regalo.entity';
import { TiendaEntity } from '../tienda/tienda.entity';
import { TiendaRegaloService } from './tienda-regalo.service';
import { TiendaRegaloController } from './tienda-regalo.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [TiendaRegaloService, JwtService],
  imports: [TypeOrmModule.forFeature([TiendaEntity, RegaloEntity])],
  controllers: [TiendaRegaloController],
})

export class TiendaRegaloModule {}
