/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarritoEntity } from './carrito.entity';
import { CarritoService } from './carrito.service';

import { CarritoController } from './carrito.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([CarritoEntity])],
  providers: [CarritoService, JwtService],
  controllers: [CarritoController]
})
export class CarritoModule {}
