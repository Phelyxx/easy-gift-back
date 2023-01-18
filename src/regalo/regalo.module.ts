/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegaloEntity } from './regalo.entity';
import { RegaloService } from './regalo.service';
import { RegaloController } from './regalo.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([RegaloEntity])],
  providers: [RegaloService, JwtService],
  controllers: [RegaloController]
})
export class RegaloModule {}
