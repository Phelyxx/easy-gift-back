import { Module } from '@nestjs/common';
import { UsuarioUsuarioService } from './usuario-usuario.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsuarioEntity } from '../usuario/usuario.entity';
import { UsuarioUsuarioController } from './usuario-usuario.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity])],
  providers: [UsuarioUsuarioService, JwtService],
  controllers: [UsuarioUsuarioController]
})
export class UsuarioUsuarioModule {}
