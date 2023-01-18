import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaEntity } from '../categoria/categoria.entity';
import { RegaloEntity } from '../regalo/regalo.entity';
import { CategoriaRegaloService } from './categoria-regalo.service';
import { CategoriaRegaloController } from './categoria-regalo.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [CategoriaRegaloService, JwtService],
  imports: [TypeOrmModule.forFeature([CategoriaEntity, RegaloEntity])],
  controllers: [CategoriaRegaloController],
})
export class CategoriaRegaloModule {}
