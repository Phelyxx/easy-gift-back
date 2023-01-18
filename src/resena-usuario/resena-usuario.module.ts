import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResenaEntity } from '../resena/resena.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { ResenaUsuarioService } from './resena-usuario.service';
import { ResenaUsuarioController } from './resena-usuario.controller';
import { JwtService } from '@nestjs/jwt';


@Module({
  providers: [ResenaUsuarioService, JwtService],
  imports: [TypeOrmModule.forFeature([ResenaEntity, UsuarioEntity])],
  controllers: [ResenaUsuarioController],
})
export class ResenaUsuarioModule {}
