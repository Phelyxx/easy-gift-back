import { UsuarioService } from './usuario.service';
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { UsuarioDto } from './usuario.dto';
import { UsuarioEntity } from './usuario.entity';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../user/roles/roles.guard';
import { Role } from '../user/roles/role.enum';
import { Roles } from '../user/roles/roles.decorator';


@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(BusinessErrorsInterceptor)
export class UsuarioController {

    
    constructor(private readonly usuarioService: UsuarioService) {}

    @Get()
    @Roles(Role.USUARIO_ADMIN, Role.USUARIO_LECTURA)
    async findAll() {
      return await this.usuarioService.findAll();
    }

    @Roles(Role.USUARIO_ADMIN, Role.USUARIO_LECTURA)
    @Get(':usuarioId')
    async findOne(@Param('usuarioId') usuarioId: string) {
    return await this.usuarioService.findOne(usuarioId);
    }
    
    @Roles(Role.USUARIO_ADMIN, Role.USUARIO_ESCRITURA)
    @Post()
    async create(@Body() usuarioDto: UsuarioDto) {
    const usuario: UsuarioEntity = plainToInstance(UsuarioEntity , usuarioDto);
    return await this.usuarioService.create(usuario);
    }

    @Roles(Role.USUARIO_ADMIN, Role.USUARIO_ESCRITURA)
    @Put(':usuarioId')
    async update(@Param('usuarioId') usuarioId: string, @Body() usuarioDto: UsuarioDto) {
    const usuario: UsuarioEntity = plainToInstance(UsuarioEntity , usuarioDto);
    return await this.usuarioService.update(usuarioId, usuario);
    }  


    @Roles(Role.USUARIO_ADMIN, Role.USUARIO_ELIMINACION)
    @Delete(':usuarioId')
    @HttpCode(204)
    async delete(@Param('usuarioId') usuarioId: string) {
    return await this.usuarioService.delete(usuarioId);
  }




}

