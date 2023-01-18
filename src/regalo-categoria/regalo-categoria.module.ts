import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaEntity } from '../categoria/categoria.entity';
import { RegaloEntity } from '../regalo/regalo.entity';
import { RegaloCategoriaService } from './regalo-categoria.service';
import { RegaloCategoriaController } from './regalo-categoria.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([RegaloEntity, CategoriaEntity])],
  providers: [RegaloCategoriaService, JwtService],
  controllers: [RegaloCategoriaController]
})
export class RegaloCategoriaModule {}
