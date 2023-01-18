/* eslint-disable prettier/prettier */
import { Controller, UseInterceptors, Post,Body, UseGuards, Param, Put, Delete, Get } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ResenaDto } from '../resena/resena.dto';
import { ResenaEntity } from '../resena/resena.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '../user/roles/role.enum';
import { Roles } from '../user/roles/roles.decorator';
import { RolesGuard } from '../user/roles/roles.guard';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ResenaUsuarioService } from './resena-usuario.service';

@Controller('usuarios')
@UseInterceptors(BusinessErrorsInterceptor)
export class ResenaUsuarioController {
    constructor(private readonly resenaUsuairoService: ResenaUsuarioService) {

        
    }

    @Post(':usuarioId/resenas/:resenaId')
    @UseGuards(JwtAuthGuard, RolesGuard)   
    @Roles(Role.USUARIO_RESENA_ADMIN, Role.USUARIO_CATEGORIA_ESCRITURA)
    async addResenaUsuario(@Param('usuarioId') usuarioId: string, @Param('resenaId') resenaId: string){
        return await this.resenaUsuairoService.addResenaUsuario(usuarioId,resenaId);
    } 
    

    @Get(':usuarioId/resenas/:resenaId')
    @UseGuards(JwtAuthGuard, RolesGuard)   
    @Roles(Role.USUARIO_RESENA_ADMIN, Role.USUARIO_RESENA_LECTURA)
    async findResenaByUsuarioIdResenaId(@Param('usuarioId') usuarioId: string, @Param('resenaId') resenaId: string){
        return await this.resenaUsuairoService.findResenaByUsuarioIdResenaID(usuarioId,resenaId);
    }

    @Get(':usuarioId/resenas')
    @UseGuards(JwtAuthGuard, RolesGuard)   
    @Roles(Role.USUARIO_RESENA_ADMIN, Role.USUARIO_RESENA_LECTURA)
    async findResenasByUsuarioId(@Param('usuarioId') usurioId: string){
        return await this.resenaUsuairoService.findResenasByUsuarioId(usurioId);
    }

    @Put(':usuarioId/resenas')
    @UseGuards(JwtAuthGuard, RolesGuard)   
    @Roles(Role.USUARIO_RESENA_ADMIN, Role.USUARIO_CATEGORIA_ESCRITURA)
    async associateResenasUsuario(@Body() resenasDto: ResenaDto[], @Param('usuarioId') usuarioId: string){
        const resenas = plainToInstance(ResenaEntity, resenasDto)
        return await this.resenaUsuairoService.associateResenaUsuario(usuarioId,resenas);
    }

    @Delete(':usuarioId/resenas/:resenaId')
    @UseGuards(JwtAuthGuard, RolesGuard)   
    @Roles(Role.USUARIO_RESENA_ADMIN, Role.USUARIO_CATEGORIA_ELIMINACION)
    async deleteResenaUsuario(@Param('usuarioId') usuarioId: string, @Param('resenaId') resenaId: string){
        return await this.resenaUsuairoService.deleteResenaUsuario(usuarioId, resenaId);
    }

}


