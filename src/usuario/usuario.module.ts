import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './usuario.entity';
import { UsuarioController } from './usuario.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [UsuarioService, JwtService],
  imports: [TypeOrmModule.forFeature([UsuarioEntity])],
  controllers: [UsuarioController]
})
export class UsuarioModule {
}
