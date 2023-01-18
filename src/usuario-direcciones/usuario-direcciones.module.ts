import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalizacionEntity } from '../localizacion/localizacion.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { UsuarioDireccionesService } from './usuario-direcciones.service';
import { UsuarioDireccionesController } from './usuario-direcciones.controller';
import { JwtService } from '@nestjs/jwt';


@Module({
  providers: [UsuarioDireccionesService, JwtService],
  imports: [TypeOrmModule.forFeature([UsuarioEntity, LocalizacionEntity])],
  controllers: [UsuarioDireccionesController],
})
export class UsuarioDireccionesModule {}
