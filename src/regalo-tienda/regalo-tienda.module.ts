import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiendaEntity } from '../tienda/tienda.entity';
import { RegaloEntity } from '../regalo/regalo.entity';
import { RegaloTiendaService } from './regalo-tienda.service';
import { RegaloTiendaController } from './regalo-tienda.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([RegaloEntity, TiendaEntity])],
  providers: [RegaloTiendaService, JwtService],
  controllers: [RegaloTiendaController]
})
export class RegaloTiendaModule {}
