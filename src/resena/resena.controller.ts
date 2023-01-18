/* eslint-disable prettier/prettier */
import { Controller, UseInterceptors, HttpCode,Get,Delete, Param, Post, Body, Put,UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from 'src/user/roles/role.enum';
import { Roles } from 'src/user/roles/roles.decorator';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { ResenaDto } from './resena.dto';
import { ResenaEntity } from './resena.entity';
import { ResenaService } from './resena.service';
import { RolesGuard } from '../user/roles/roles.guard';

@Controller('resena')
@UseInterceptors(BusinessErrorsInterceptor)
export class ResenaController {
    constructor(private readonly resenaService: ResenaService) {}

    @Get()
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.RESENA_ADMIN, Role.RESENA_LECTURA)
    async findAll() {
        return await this.resenaService.findAll(); 
    }

    @Get(':resenaId')
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.RESENA_ADMIN, Role.RESENA_LECTURA)
    async findOne(@Param('resenaId') resenaId:string){
        return await this.resenaService.findOne(resenaId);
    }

    @Post()
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.RESENA_ADMIN, Role.RESENA_ESCRITURA)
    async create(@Body() resenaDto: ResenaDto){
        const resena: ResenaEntity = plainToInstance(ResenaEntity,resenaDto);
        return await this.resenaService.create(resena);
    }

    @Put(':resenaId')
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.RESENA_ADMIN, Role.RESENA_ESCRITURA)
    async update(@Param('resenaId') resenaId: string, @Body() resenaDto: ResenaDto){
        const resena: ResenaEntity = plainToInstance(ResenaEntity, resenaDto);
        return await this.resenaService.update(resenaId,resena);
    }

    @Delete(':resenaId')
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.RESENA_ADMIN, Role.RESENA_ELIMINACION)
    @HttpCode(204)
    async delete(@Param('resenaId') resenaId: string){
        return await this.resenaService.delete(resenaId);
    }

}
