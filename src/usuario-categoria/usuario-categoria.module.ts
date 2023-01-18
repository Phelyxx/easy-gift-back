import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaEntity } from '../categoria/categoria.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { UsuarioCategoriaService } from './usuario-categoria.service';
import { UsuarioCategoriaController } from './usuario-categoria.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [UsuarioCategoriaService, JwtService],
  imports: [TypeOrmModule.forFeature([UsuarioEntity, CategoriaEntity])],
  controllers: [UsuarioCategoriaController],
})
export class UsuarioCategoriaModule {}
