/* eslint-disable prettier/prettier */
import { Controller, UseInterceptors, Post,Body, Param, Put, Delete, UseGuards, Get } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ResenaDto } from '../resena/resena.dto';
import { ResenaEntity } from '../resena/resena.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '../user/roles/role.enum';
import { Roles } from '../user/roles/roles.decorator';
import { RolesGuard } from '../user/roles/roles.guard';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RegaloResenaService } from './regalo-resena.service';


@Controller('regalos')
@UseInterceptors(BusinessErrorsInterceptor)
export class RegaloResenaController {
    constructor(private readonly resenaRegaloService: RegaloResenaService){}

    
    @Post(':regaloId/resenas/:resenaId')
    @UseGuards(JwtAuthGuard, RolesGuard)   
    @Roles(Role.REGALO_RESENA_ADMIN, Role.REGALO_RESENA_ESCRITURA)
    async addResenaRegalo(@Param('regaloId') regaloId: string, @Param('resenaId') resenaId: string){
        return await this.resenaRegaloService.addResenaRegalo(regaloId,resenaId);
    }

    @Get(':regaloId/resenas/:resenaId')
    @UseGuards(JwtAuthGuard, RolesGuard)   
    @Roles(Role.REGALO_RESENA_ADMIN, Role.REGALO_RESENA_LECTURA)
    async findResenaByRegaloIdResenaId(@Param('regaloId') regaloId: string, @Param('resenaId') resenaId: string){
        return await this.resenaRegaloService.findRegaloByRegaloIdResenaID(regaloId,resenaId);
    }

    @Get(':regaloId/resenas')
    @UseGuards(JwtAuthGuard, RolesGuard)   
    @Roles(Role.REGALO_RESENA_ADMIN, Role.REGALO_RESENA_LECTURA)
    async findResenasByUsuarioId(@Param('regaloId') regaloId: string){
        return await this.resenaRegaloService.findResenasByRegaloId(regaloId);
    }

    @Put(':regaloId/resenas')
    @UseGuards(JwtAuthGuard, RolesGuard)   
    @Roles(Role.REGALO_RESENA_ADMIN, Role.REGALO_RESENA_ESCRITURA)
    async associateResenasUsuario(@Body() resenasDto: ResenaDto[], @Param('regaloId') regaloId: string){
        const resenas = plainToInstance(ResenaEntity, resenasDto)
        return await this.resenaRegaloService.associateResenaRegalo(regaloId,resenas);
    }

    @Delete(':regaloId/resenas/:resenaId')
    @UseGuards(JwtAuthGuard, RolesGuard)   
    @Roles(Role.REGALO_RESENA_ADMIN, Role.REGALO_RESENA_ELIMINACION)
    async deleteResenaUsuario(@Param('regaloId') regaloId: string, @Param('resenaId') resenaId: string){
        return await this.resenaRegaloService.deleteResenaRegalo(regaloId, resenaId);
    }


}
