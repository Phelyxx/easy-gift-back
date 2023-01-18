/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResenaEntity } from './resena.entity';
import { ResenaService } from './resena.service';
import { ResenaController } from './resena.controller';

import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [TypeOrmModule.forFeature([ResenaEntity])],
  providers: [ResenaService, JwtService],
  controllers: [ResenaController]
})
export class ResenaModule {}
