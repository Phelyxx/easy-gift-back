import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarritoEntity } from '../carrito/carrito.entity';
import { RegaloEntity } from '../regalo/regalo.entity';
import { CarritoRegaloService } from './carrito-regalo.service';
import { CarritoRegaloController } from './carrito-regalo.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [CarritoRegaloService, JwtService],
  imports: [TypeOrmModule.forFeature([CarritoEntity, RegaloEntity])],
  controllers: [CarritoRegaloController],
})
export class CarritoRegaloModule {}
